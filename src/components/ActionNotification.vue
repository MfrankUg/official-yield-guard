<script setup>
import { ref } from 'vue'
import { useMQTT } from '../composables/useMQTT'
import { useLanguage } from '../composables/useLanguage'
import { AlertTriangle, Info } from 'lucide-vue-next'

const { activePopup } = useMQTT()
const { t } = useLanguage()

const closePopup = () => {
  activePopup.value = null
}

const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)

const onTouchStart = (e) => {
  startX.value = e.touches ? e.touches[0].clientX : e.clientX
  isDragging.value = true
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  currentX.value = clientX - startX.value
}

const onTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  // If swiped more than 80px left or right, dismiss it
  if (Math.abs(currentX.value) > 80) {
    const direction = currentX.value > 0 ? window.innerWidth : -window.innerWidth
    currentX.value = direction
    setTimeout(() => {
      closePopup()
      // Reset translation after it is closed so the next popup starts fresh
      setTimeout(() => { currentX.value = 0 }, 300)
    }, 150) // wait for it to fly off screen
  } else {
    // Snap back to center
    currentX.value = 0
  }
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
        class="pointer-events-auto w-full max-w-lg md:max-w-2xl bg-base-secondary rounded-2xl shadow-2xl border-2 flex overflow-hidden relative cursor-grab active:cursor-grabbing"
        :class="[
          activePopup.severity === 'danger' ? 'border-[var(--color-accent-red)]' : 'border-orange-500',
          !isDragging ? 'transition-all duration-300' : ''
        ]"
        :style="currentX ? { transform: `translateX(${currentX}px)`, opacity: 1 - Math.abs(currentX)/300 } : {}"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onTouchStart"
        @mousemove="onTouchMove"
        @mouseup="onTouchEnd"
        @mouseleave="onTouchEnd"
      >
        <!-- Icon Side -->
        <div 
          class="w-12 sm:w-16 flex items-center justify-center shrink-0"
          :class="activePopup.severity === 'danger' ? 'bg-[var(--color-accent-red)] text-white' : 'bg-orange-500 text-white'"
        >
          <AlertTriangle v-if="activePopup.severity === 'danger'" class="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
          <AlertTriangle v-else class="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <!-- Content Side -->
        <div class="p-3 sm:p-4 flex-1">
          <div class="flex justify-between items-start">
            <h3 
              class="font-bold text-sm sm:text-base leading-tight mb-1"
              :class="activePopup.severity === 'danger' ? 'text-[var(--color-accent-red)]' : 'text-orange-600 dark:text-orange-500'"
            >
              {{ activePopup.message }}
            </h3>
          </div>
          <p class="text-xs sm:text-sm text-content-primary font-medium flex items-center mt-1">
            <Info class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-content-secondary" />
            {{ t('popup.action') }}: {{ activePopup.action }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>
