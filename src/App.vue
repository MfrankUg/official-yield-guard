<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import TopHeader from './components/TopHeader.vue'
import AIChatInterface from './components/AIChatInterface.vue'
import ActionNotification from './components/ActionNotification.vue'
import { useMQTT } from './composables/useMQTT'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'

const { 
  isConnected, 
  connect, 
  disconnect 
} = useMQTT()

const { initTheme } = useTheme()
const { user, loading: authLoading } = useAuth()

const route = useRoute()
const router = useRouter()

const isGlobalLoading = ref(false)

const isPublicRoute = computed(() => ['/', '/login', '/signup'].includes(route.path))
const showShell = computed(() => !isPublicRoute.value && user.value)

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
  if (user.value) connect()
})

// Watch for user changes to connect/disconnect MQTT
import { watch } from 'vue'
watch(user, (newUser) => {
  if (newUser) {
    connect()
  } else {
    disconnect()
  }
})

onUnmounted(() => {
  disconnect()
})

</script>

<template>
  <!-- Main App Container -->
  <div class="min-h-screen bg-base-primary text-content-primary font-sans relative overflow-hidden flex h-[100dvh]">
    
    <!-- Global Action Notifications (Popups) -->
    <ActionNotification v-if="!isPublicRoute" />

    <!-- Sidebar: Only show on non-public routes for authenticated users -->
    <template v-if="showShell">
      <!-- Mobile Sidebar Backdrop -->
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false" 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
      ></div>
      <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />
    </template>
    
    <main class="flex-1 flex flex-col h-full overflow-hidden relative min-w-0" :class="{'bg-white': isPublicRoute}">
      <!-- Header: Only show for authenticated users -->
      <TopHeader v-if="showShell" @toggle-sidebar="toggleSidebar" />
      
      <!-- Connection Status Banner: Only show for authenticated users -->
      <div 
        v-if="showShell && !isConnected" 
        class="bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] px-6 py-2 text-sm font-medium border-b border-[var(--color-accent-red)]/20 flex items-center justify-center shrink-0"
      >
        <span class="w-2 h-2 rounded-full bg-[var(--color-accent-red)] animate-pulse mr-2"></span>
        Connecting to Yield Guard Sensors...
      </div>

      <div 
        class="flex-1 relative"
        :class="[
          isPublicRoute ? '' : (route.path === '/ai-assistant' ? 'p-0 overflow-hidden flex flex-col' : 'p-4 sm:p-8 overflow-y-auto overflow-x-hidden')
        ]"
      >
        <!-- Main Route View -->
        <router-view v-slot="{ Component }">
          <transition name="page-slide">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
      
      <!-- Floating AI Assistant: Only on non-public dashboard routes for auth users (except AI page) -->
      <AIChatInterface v-if="showShell && route.path !== '/ai-assistant'" />
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
