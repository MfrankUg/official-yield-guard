<script setup>
import { Loader2 } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  message: {
    type: String,
    default: 'Initializing Secure Session...'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-400 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      <div class="flex flex-col items-center">
        <!-- Logo with pulse effect -->
        <div class="relative mb-8">
          <div class="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse scale-150"></div>
          <img src="../assets/logo.png" class="w-24 h-24 rounded-full border-2 border-white/20 shadow-2xl relative z-10" alt="Logo" />
        </div>
        
        <!-- Spinner -->
        <Loader2 class="w-10 h-10 text-white animate-spin mb-4" />
        
        <!-- Text -->
        <h2 class="text-white text-xl font-bold tracking-tight mb-2">{{ message }}</h2>
        <p class="text-blue-200/60 text-sm font-medium animate-pulse">Yield Guard Warehouse Intelligence</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}
</style>
