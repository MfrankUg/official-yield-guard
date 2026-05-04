<script setup>
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

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
  min24h: {
    type: [Number, String],
    required: true
  },
  max24h: {
    type: [Number, String],
    required: true
  },
  colorClass: {
    type: String,
    default: 'bg-[var(--color-accent-blue)]'
  },
  warning: {
    type: Boolean,
    default: false
  }
})

const percentage = computed(() => {
  const range = props.max24h - props.min24h
  if (range === 0) return 50
  let pct = ((props.value - props.min24h) / range) * 100
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
        <AlertTriangle v-if="warning" class="w-5 h-5 text-[var(--color-accent-red)] animate-pulse" />
        <div class="text-[10px] uppercase tracking-wider font-semibold text-content-secondary px-2 py-1 bg-base-primary rounded-md border border-border-soft">
          Live
        </div>
      </div>
    </div>
    
    <div class="mb-6 flex items-baseline">
      <span class="text-4xl font-bold text-content-primary tracking-tight">{{ value !== null && value !== undefined ? value.toFixed(1) : '--' }}</span>
      <span class="text-xl text-content-secondary ml-1 font-medium">{{ unit }}</span>
    </div>

    <!-- 24h Range Bar -->
    <div class="space-y-2">
      <div class="flex justify-between text-xs text-content-secondary font-medium">
        <span>Min: {{ min24h }}{{ unit }}</span>
        <span>Max: {{ max24h }}{{ unit }}</span>
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
