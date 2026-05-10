<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Bell, Menu, CheckCircle2, AlertTriangle, Sun, Moon } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'
import { useAuth } from '../composables/useAuth'
import LanguageDropdown from './LanguageDropdown.vue'
import { User } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const { notifications, unreadCount, clearNotifications, resetUnreadCount } = useMQTT()
const { isDarkMode, toggleTheme } = useTheme()
const { t } = useLanguage()
const { user } = useAuth()

const currentDateTime = ref('')
const isDropdownOpen = ref(false)
let timer

const updateDateTime = () => {
  const now = new Date()
  const options = { weekday: 'long', day: '2-digit', month: '2-digit' }
  const dateStr = now.toLocaleDateString('en-GB', options).replace('/', '.')
  
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }
  const timeStr = now.toLocaleTimeString('en-GB', timeOptions)
  
  currentDateTime.value = `${dateStr}, ${timeStr} EAT`
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    resetUnreadCount()
  }
}

// Close dropdown if clicked outside (simple implementation)
const closeDropdown = () => {
  isDropdownOpen.value = false
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 60000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <header class="h-20 flex items-center justify-between px-4 sm:px-8 bg-base-primary border-b border-border-soft relative transition-colors duration-300">
    
    <div class="flex items-center flex-1">
      <!-- Hamburger Menu -->
      <button 
        @click="emit('toggle-sidebar')"
        class="lg:hidden p-2 mr-4 text-content-secondary hover:text-content-primary transition-colors"
      >
        <Menu class="w-6 h-6" />
      </button>

      <!-- Search Bar -->
      <div class="relative w-full max-w-sm hidden sm:block">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-content-secondary" />
        </div>
        <input
          type="text"
          class="block w-full pl-11 pr-4 py-2.5 bg-base-secondary border border-border-soft rounded-xl text-content-primary placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] focus:border-transparent transition-all text-sm"
          :placeholder="t('header.search')"
        />
      </div>
    </div>

    <!-- Right side items -->
    <div class="flex items-center space-x-2 sm:space-x-4">
      
      <!-- Language Dropdown -->
      <LanguageDropdown class="mr-2" />

      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 text-content-secondary hover:text-content-primary transition-colors bg-base-secondary border border-border-soft rounded-lg mr-2"
        title="Toggle Theme"
      >
        <Sun v-if="isDarkMode" class="w-4 h-4 sm:w-5 sm:h-5" />
        <Moon v-else class="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <!-- Date/Time -->
      <div class="hidden md:block text-content-secondary text-sm font-medium bg-base-secondary px-4 py-2 rounded-lg border border-border-soft shadow-sm">
        {{ currentDateTime }}
      </div>

      <!-- User Info -->
      <div v-if="user" class="hidden sm:flex items-center space-x-2 bg-base-secondary px-3 py-1.5 rounded-xl border border-border-soft">
        <div class="w-7 h-7 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center">
          <User class="w-4 h-4 text-[var(--color-accent-blue)]" />
        </div>
        <span class="text-xs font-semibold text-content-primary truncate max-w-[120px]">
          {{ user.email }}
        </span>
      </div>
      
      <!-- Notification Bell -->
      <div class="relative">
        <button 
          @click="toggleDropdown"
          class="relative p-2 text-content-secondary hover:text-content-primary transition-colors"
        >
          <Bell class="w-5 h-5" />
          <span 
            v-if="unreadCount > 0"
            class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--color-accent-red)] ring-2 ring-base-primary animate-pulse"
          ></span>
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isDropdownOpen" 
          class="absolute right-0 mt-2 w-80 bg-base-secondary rounded-xl border border-border-soft shadow-2xl z-50 overflow-hidden flex flex-col max-h-[400px]"
        >
          <div class="p-4 border-b border-border-soft flex justify-between items-center bg-base-secondary shrink-0">
            <h3 class="font-bold text-content-primary">{{ t('header.notifications') }}</h3>
            <button 
              v-if="notifications.length > 0"
              @click="clearNotifications" 
              class="text-xs text-content-secondary hover:text-[var(--color-accent-blue)] transition-colors"
            >
              {{ t('header.clearAll') }}
            </button>
          </div>
          
          <div class="overflow-y-auto flex-1">
            <div v-if="notifications.length === 0" class="p-6 text-center text-content-secondary text-sm flex flex-col items-center">
              <CheckCircle2 class="w-8 h-8 text-green-500/50 mb-2" />
              {{ t('header.allOptimal') }}
            </div>
            
            <div 
              v-else 
              v-for="note in notifications" 
              :key="note.id" 
              class="p-4 border-b border-border-soft hover:bg-base-primary/50 transition-colors last:border-b-0"
            >
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 rounded-full bg-[var(--color-accent-red)]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent-red)]" />
                </div>
                <div>
                  <p class="text-sm font-medium text-content-primary">{{ note.message }}</p>
                  <p class="text-xs text-content-secondary mt-1">{{ note.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invisible backdrop for closing dropdown -->
        <div 
          v-if="isDropdownOpen" 
          @click="closeDropdown" 
          class="fixed inset-0 z-40"
        ></div>
      </div>

    </div>
  </header>
</template>
