<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import TopHeader from './components/TopHeader.vue'
import AIChatInterface from './components/AIChatInterface.vue'
import { useMQTT } from './composables/useMQTT'
import { useTheme } from './composables/useTheme'

const { 
  isConnected, 
  connect, 
  disconnect 
} = useMQTT()

const { initTheme } = useTheme()

const route = useRoute()

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  initTheme()
  connect()
})

onUnmounted(() => {
  disconnect()
})

</script>

<template>
  <div class="flex h-screen bg-base-primary text-content-primary overflow-hidden font-sans relative">
    
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
    ></div>

    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <main class="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
      <TopHeader @toggle-sidebar="toggleSidebar" />
      
      <!-- Connection Status Banner -->
      <div 
        v-if="!isConnected" 
        class="bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] px-6 py-2 text-sm font-medium border-b border-[var(--color-accent-red)]/20 flex items-center justify-center shrink-0"
      >
        <span class="w-2 h-2 rounded-full bg-[var(--color-accent-red)] animate-pulse mr-2"></span>
        Connecting to Yield Guard Sensors...
      </div>

      <div class="flex-1 overflow-y-auto p-4 sm:p-8">
        <!-- Render current route -->
        <router-view></router-view>
      </div>
      
      <!-- Floating AI Assistant (Hidden on full AI Assistant page) -->
      <AIChatInterface v-if="route.path !== '/ai-assistant'" />
      
    </main>
  </div>
</template>

<style>
/* Any additional global tweaks can go here, but most is handled by Tailwind */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-base-primary); 
}
::-webkit-scrollbar-thumb {
  background: var(--color-border-soft); 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-content-secondary); 
}
</style>
