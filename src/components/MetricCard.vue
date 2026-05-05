<script setup>
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],
    required: true
  },
  value: {
    type: [Number, String],
    required: false,
    default: null
  },
  unit: {
    type: String,
    required: true
  },
  optimalMin: {
    type: [Number, String],
    required: true
  },
  optimalMax: {
    type: [Number, String],
    required: true
  },
  colorClass: {
    type: String,
    default: 'bg-[var(--color-accent-blue)]'
  },
  status: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'warning', 'danger'].includes(value)
  }
})

const percentage = computed(() => {
  const range = props.optimalMax - props.optimalMin
  if (range === 0 || isNaN(range)) return 50
  let pct = ((props.value - props.optimalMin) / range) * 100
  return Math.max(0, Math.min(100, pct))
})
</script>

<template>
  <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm hover:shadow-md transition-shadow relative">
    <div class="flex justify-between items-start mb-6">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 rounded-xl bg-base-primary border border-border-soft">
          <component :is="icon" class="w-6 h-6 text-content-primary" />
        </div>
        <h3 class="text-content-secondary font-medium">{{ title }}</h3>
      </div>
      <div class="flex items-center space-x-2">
        <div v-if="status === 'danger'" class="flex items-center space-x-1 text-white animate-pulse bg-[var(--color-accent-red)] px-2.5 py-1 rounded-md shadow-sm shadow-[var(--color-accent-red)]/30">
          <AlertTriangle class="w-3.5 h-3.5" />
          <span class="text-[10px] uppercase tracking-wider font-bold">{{ t('card.danger') }}</span>
        </div>
        <div v-else-if="status === 'warning'" class="flex items-center space-x-1 text-white bg-orange-500 px-2.5 py-1 rounded-md shadow-sm shadow-orange-500/30">
          <AlertTriangle class="w-3.5 h-3.5" />
          <span class="text-[10px] uppercase tracking-wider font-bold">{{ t('card.warning') }}</span>
        </div>
        <div v-else-if="status === 'normal'" class="flex items-center space-x-1 text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 px-2.5 py-1 rounded-md border border-[var(--color-accent-blue)]/20">
          <div class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)]"></div>
          <span class="text-[10px] uppercase tracking-wider font-bold">{{ t('card.normal') }}</span>
        </div>
      </div>
    </div>
    
    <div class="mb-6 flex items-baseline">
      <span class="text-4xl font-bold text-content-primary tracking-tight">{{ value !== null && value !== undefined ? value.toFixed(1) : '--' }}</span>
      <span class="text-xl text-content-secondary ml-1 font-medium">{{ unit }}</span>
    </div>

    <!-- Optimal Range Bar -->
    <div class="space-y-2">
      <div class="flex justify-between text-xs text-content-secondary font-medium">
        <span>{{ t('card.optimalMin') }}: {{ optimalMin }}{{ unit }}</span>
        <span>{{ t('card.optimalMax') }}: {{ optimalMax }}{{ unit }}</span>
      </div>
      <div class="h-2 w-full bg-base-primary rounded-full overflow-hidden border border-border-soft relative">
        <!-- Range indicators / visual bar -->
        <div 
          class="absolute h-full rounded-full transition-all duration-500 ease-out"
          :class="colorClass"
          :style="{ width: `${percentage}%` }"
        >
          <!-- Current value indicator blob -->
          <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-transparent z-10 hidden"></div>
        </div>
      </div>
    </div>
  </div>
</template>
