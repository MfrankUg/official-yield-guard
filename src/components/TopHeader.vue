<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Bell, Menu } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const currentDateTime = ref('')
let timer

const updateDateTime = () => {
  const now = new Date()
  const options = { weekday: 'long', day: '2-digit', month: '2-digit' }
  const dateStr = now.toLocaleDateString('en-GB', options).replace('/', '.')
  
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }
  const timeStr = now.toLocaleTimeString('en-GB', timeOptions)
  
  // Hardcoding EAT for display purposes as requested, or determining local timezone.
  currentDateTime.value = `${dateStr}, ${timeStr} EAT`
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
  <header class="h-20 flex items-center justify-between px-4 sm:px-8 bg-base-primary border-b border-border-soft">
    
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
          placeholder="Select Warehouse / Zone"
        />
      </div>
    </div>

    <!-- Right side items -->
    <div class="flex items-center space-x-4 sm:space-x-6">
      <div class="hidden md:block text-content-secondary text-sm font-medium bg-base-secondary px-4 py-2 rounded-lg border border-border-soft shadow-sm">
        {{ currentDateTime }}
      </div>
      
      <button class="relative p-2 text-content-secondary hover:text-content-primary transition-colors">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--color-accent-red)] ring-2 ring-base-primary"></span>
      </button>
    </div>
  </header>
</template>
