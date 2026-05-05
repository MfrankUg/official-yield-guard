<script setup>
import { computed } from 'vue'
import { useMQTT } from '../composables/useMQTT'
import { AlertTriangle, Info, X } from 'lucide-vue-next'

const { activePopup } = useMQTT()

const closePopup = () => {
  activePopup.value = null
}
</script>

<template>
  <transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-400 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div 
      v-if="activePopup" 
      class="fixed top-4 left-0 right-0 z-[200] flex justify-center pointer-events-none px-4"
    >
      <div 
        class="pointer-events-auto w-full max-w-lg md:max-w-2xl bg-base-secondary rounded-2xl shadow-2xl border-2 flex overflow-hidden relative"
        :class="activePopup.severity === 'danger' ? 'border-[var(--color-accent-red)]' : 'border-yellow-500'"
      >
        <!-- Icon Side -->
        <div 
          class="w-12 sm:w-16 flex items-center justify-center shrink-0"
          :class="activePopup.severity === 'danger' ? 'bg-[var(--color-accent-red)] text-white' : 'bg-yellow-500 text-white'"
        >
          <AlertTriangle v-if="activePopup.severity === 'danger'" class="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
          <AlertTriangle v-else class="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <!-- Content Side -->
        <div class="p-3 sm:p-4 flex-1">
          <div class="flex justify-between items-start">
            <h3 
              class="font-bold text-sm sm:text-base leading-tight mb-1"
              :class="activePopup.severity === 'danger' ? 'text-[var(--color-accent-red)]' : 'text-yellow-600 dark:text-yellow-500'"
            >
              {{ activePopup.message }}
            </h3>
          </div>
          <p class="text-xs sm:text-sm text-content-primary font-medium flex items-center mt-1">
            <Info class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-content-secondary" />
            Action: {{ activePopup.action }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>
