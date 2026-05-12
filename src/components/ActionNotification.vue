<script setup>
import { ref, computed } from 'vue'
import { useMQTT } from '../composables/useMQTT'
import { useLanguage } from '../composables/useLanguage'
import { AlertTriangle, Info, X, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const { activePopup } = useMQTT()
const { t } = useLanguage()

const closePopup = () => {
  activePopup.value = null
}

const styles = computed(() => {
  if (!activePopup.value) return {}
  const s = activePopup.value.severity
  if (s === 'danger') {
    return {
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-500',
      icon: 'text-red-500',
      title: 'Error',
      iconComponent: AlertCircle
    }
  } else if (s === 'warning') {
    return {
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      border: 'border-orange-500',
      icon: 'text-orange-500',
      title: 'Warning',
      iconComponent: AlertTriangle
    }
  } else if (s === 'success') {
    return {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-500',
      icon: 'text-green-500',
      title: 'Success',
      iconComponent: CheckCircle2
    }
  } else {
    return {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-500',
      icon: 'text-blue-500',
      title: 'Info',
      iconComponent: Info
    }
  }
})

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
  
  if (Math.abs(currentX.value) > 80) {
    const direction = currentX.value > 0 ? window.innerWidth : -window.innerWidth
    currentX.value = direction
    setTimeout(() => {
      closePopup()
      setTimeout(() => { currentX.value = 0 }, 300)
    }, 150)
  } else {
    currentX.value = 0
  }
}
</script>

<template>
  <transition
    enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
    enter-from-class="transform -translate-y-full opacity-0 scale-95"
    enter-to-class="transform translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100 scale-100"
    leave-to-class="transform -translate-y-full opacity-0 scale-95"
  >
    <div 
      v-if="activePopup" 
      class="fixed top-6 left-0 right-0 z-[200] flex justify-center pointer-events-none px-4"
    >
      <div 
        class="pointer-events-auto w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border-b-[5px] flex items-start p-4 relative cursor-grab active:cursor-grabbing group overflow-hidden"
        :class="[
          styles.bg,
          styles.border,
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
        <!-- Icon -->
        <div class="mr-4 mt-0.5 shrink-0">
          <component :is="styles.iconComponent" class="w-6 h-6" :class="styles.icon" />
        </div>

        <!-- Content -->
        <div class="flex-1 pr-6">
          <h4 class="font-bold text-sm text-zinc-900 dark:text-white leading-tight">
            {{ styles.title }}
          </h4>
          <p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
            {{ activePopup.message }}
          </p>
          <div v-if="activePopup.action" class="mt-2 flex items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span class="mr-1.5 opacity-50">Suggestion:</span>
            <span class="text-zinc-700 dark:text-zinc-300">{{ activePopup.action }}</span>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          @click="closePopup"
          class="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X class="w-4 h-4" />
        </button>

        <!-- Swipe Indicator (Only visible on mobile) -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/10 dark:bg-white/10 rounded-full mb-1 sm:hidden"></div>
      </div>
    </div>
  </transition>
</template>

