<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import TopHeader from './components/TopHeader.vue'
import AIChatInterface from './components/AIChatInterface.vue'
import ActionNotification from './components/ActionNotification.vue'
import { useMQTT } from './composables/useMQTT'
import { useTheme } from './composables/useTheme'

const { 
  isConnected, 
  connect, 
  disconnect 
} = useMQTT()

const { initTheme } = useTheme()

const route = useRoute()
const router = useRouter()

const isGlobalLoading = ref(false)

const isPublicRoute = computed(() => ['/', '/login', '/signup'].includes(route.path))

// Show loading effect when navigating to the Dashboard shell
router.beforeEach((to, from, next) => {
  if (['/', '/login', '/signup'].includes(from.path) && !['/', '/login', '/signup'].includes(to.path)) {
    isGlobalLoading.value = true
    setTimeout(() => {
      isGlobalLoading.value = false
    }, 800) // 800ms premium feeling transition
  }
  next()
})

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
  <!-- Global Loading Overlay -->
  <transition name="fade-overlay">
    <div v-if="isGlobalLoading" class="fixed inset-0 z-[9999] bg-[var(--color-accent-blue)] flex flex-col items-center justify-center">
      <div class="bg-white p-4 rounded-3xl shadow-2xl mb-8 animate-pulse">
        <img src="./assets/logo.png" class="w-20 h-20 object-contain" alt="Yield Guard Logo" />
      </div>
      <div class="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
        <div class="absolute top-0 left-0 h-full bg-white rounded-full animate-loader-bar"></div>
      </div>
      <p class="text-blue-100 mt-6 font-semibold tracking-widest uppercase text-xs">Authenticating & Connecting...</p>
    </div>
  </transition>

  <!-- Public Routes (Landing, Login, Signup) -->
  <template v-if="isPublicRoute">
    <router-view />
  </template>

  <!-- Dashboard App Shell -->
  <template v-else>
    <div class="flex h-[100dvh] bg-base-primary text-content-primary overflow-hidden font-sans relative">
      
      <!-- Mobile Sidebar Backdrop -->
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false" 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
      ></div>

      <!-- Global Action Notifications -->
      <ActionNotification />

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

        <div 
          class="flex-1 relative"
          :class="route.path === '/ai-assistant' ? 'p-0 overflow-hidden flex flex-col' : 'p-4 sm:p-8 overflow-y-auto overflow-x-hidden'"
        >
          <!-- Render current route -->
          <router-view v-slot="{ Component }">
            <transition name="page-slide">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        
        <!-- Floating AI Assistant (Hidden on full AI Assistant page) -->
        <AIChatInterface v-if="route.path !== '/ai-assistant'" />
        
      </main>
    </div>
  </template>
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

/* Page Transitions */
.page-slide-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Loader Animation */
@keyframes loader-bar {
  0% { width: 0%; left: -100%; }
  50% { width: 50%; left: 25%; }
  100% { width: 100%; left: 100%; }
}
.animate-loader-bar {
  animation: loader-bar 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  width: 50%;
}

/* Fade Overlay Transition */
.fade-overlay-enter-active, .fade-overlay-leave-active {
  transition: opacity 0.5s ease;
}
.fade-overlay-enter-from, .fade-overlay-leave-to {
  opacity: 0;
}
</style>
