<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguage } from '../composables/useLanguage'
import { useAuth } from '../composables/useAuth'
import { LogOut, X as CloseIcon, Sun, History, MessageSquare, Map, LayoutGrid } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const route = useRoute()
const router = useRouter()
const { t } = useLanguage()
const { signOut } = useAuth()

const handleLogout = async () => {
  try {
    await signOut()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const navItems = computed(() => [
  { label: t('nav.dashboard'), icon: Sun, path: '/dashboard' },
  { label: t('nav.history'), icon: History, path: '/history' },
  { label: t('nav.assistant'), icon: MessageSquare, path: '/ai-assistant' },
  { label: t('nav.map'), icon: Map, path: '/map' },
  { label: t('nav.settings'), icon: LayoutGrid, path: '/settings' }
])
</script>

<template>
  <aside 
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-base-secondary border-r border-border-soft flex flex-col h-full transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Branding -->
    <div class="h-20 flex items-center justify-between px-6 border-b border-border-soft shrink-0">
      <div class="flex items-center cursor-pointer hover:opacity-80 transition-opacity" @click="route.path !== '/' ? $router.push('/') : null">
        <img src="../assets/logo.png" alt="Yield Guard" class="w-8 h-8 rounded-md mr-3" />
        <span class="text-content-primary font-bold text-xl tracking-wide">Yield Guard</span>
      </div>
      <button @click="emit('close')" class="lg:hidden p-1 text-content-secondary hover:text-content-primary transition-colors">
        <CloseIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.label"
        :to="item.path"
        @click="emit('close')"
        :class="[
          'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group',
          route.path === item.path
            ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] shadow-[inset_4px_0_0_0_var(--color-accent-blue)]' 
            : 'text-content-secondary hover:bg-white/5 hover:text-content-primary'
        ]"
      >
        <component 
          :is="item.icon" 
          class="w-5 h-5 mr-3 transition-colors duration-200"
          :class="route.path === item.path ? 'text-[var(--color-accent-blue)]' : 'text-content-secondary group-hover:text-content-primary'"
        />
        <span class="font-medium text-sm">{{ item.label }}</span>
      </router-link>
    </nav>
    <!-- Footer / Logout -->
    <div class="p-4 border-t border-border-soft shrink-0">
      <button 
        @click="handleLogout"
        class="w-full flex items-center px-4 py-3 rounded-xl text-content-secondary hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
      >
        <LogOut class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
        <span class="font-medium text-sm">{{ t('auth.logout') || 'Logout' }}</span>
      </button>
    </div>
  </aside>
</template>
