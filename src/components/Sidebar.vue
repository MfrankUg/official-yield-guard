<script setup>
import { Sun, History, MessageSquare, Map, Grid, X } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const route = useRoute()

const navItems = [
  { label: 'Live Monitor', icon: Sun, path: '/' },
  { label: 'History', icon: History, path: '/history' },
  { label: 'AI Assistant', icon: MessageSquare, path: '/ai-assistant' },
  { label: 'Warehouse Map', icon: Map, path: '/map' },
  { label: 'Settings', icon: Grid, path: '/settings' }
]
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
      <div class="flex items-center">
        <img src="../assets/logo.png" alt="Yield Guard" class="w-8 h-8 rounded-md mr-3" />
        <span class="text-content-primary font-bold text-xl tracking-wide">Yield Guard</span>
      </div>
      <button @click="emit('close')" class="lg:hidden p-1 text-content-secondary hover:text-content-primary transition-colors">
        <X class="w-5 h-5" />
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
    
    <!-- Footer: Auth Options -->
    <div class="p-6 border-t border-border-soft shrink-0">
      <div class="flex flex-col space-y-3">
        <button class="w-full py-2.5 bg-[var(--color-accent-blue)] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
          Login
        </button>
        <button class="w-full py-2.5 bg-base-primary border border-border-soft text-content-primary rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
          Sign Up
        </button>
      </div>
    </div>
  </aside>
</template>
