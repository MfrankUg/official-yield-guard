<script setup>
import { computed } from 'vue'
import MetricCard from '../components/MetricCard.vue'
import ConditionChart from '../components/ConditionChart.vue'
import { Thermometer, Droplet, Flame } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'

const { 
  currentTemperature, 
  currentHumidity, 
  currentHeatIndex,
  historicalDataPoints
} = useMQTT()

const chartData = computed(() => {
  return {
    labels: historicalDataPoints.value.map(dp => dp.timestamp),
    datasets: [
      {
        label: 'Temperature',
        data: historicalDataPoints.value.map(dp => dp.temp),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2
      },
      {
        label: 'Humidity',
        data: historicalDataPoints.value.map(dp => dp.humidity),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2
      }
    ]
  }
})

const tempMin24 = computed(() => currentTemperature.value !== null ? Math.floor(currentTemperature.value - 5) : '--')
const tempMax24 = computed(() => currentTemperature.value !== null ? Math.ceil(currentTemperature.value + 5) : '--')

const humMin24 = computed(() => currentHumidity.value !== null ? Math.floor(currentHumidity.value - 10) : '--')
const humMax24 = computed(() => currentHumidity.value !== null ? Math.ceil(currentHumidity.value + 10) : '--')

const heatMin24 = computed(() => currentHeatIndex.value !== null ? Math.floor(currentHeatIndex.value - 5) : '--')
const heatMax24 = computed(() => currentHeatIndex.value !== null ? Math.ceil(currentHeatIndex.value + 5) : '--')

</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[calc(100vh-10rem)]">
      
      <!-- Left Column: Metric Cards -->
      <div class="lg:col-span-4 flex flex-col space-y-6">
        <h2 class="text-xl font-bold text-content-primary mb-2">Live Sensors</h2>
        <MetricCard 
          title="Air Temperature"
          :icon="Thermometer"
          :value="currentTemperature"
          unit="°C"
          :min24h="tempMin24"
          :max24h="tempMax24"
          colorClass="bg-[var(--color-accent-blue)]"
        />
        <MetricCard 
          title="Relative Humidity"
          :icon="Droplet"
          :value="currentHumidity"
          unit="%"
          :min24h="humMin24"
          :max24h="humMax24"
          colorClass="bg-[var(--color-accent-red)]"
        />
        <MetricCard 
          title="Heat Index"
          :icon="Flame"
          :value="currentHeatIndex"
          unit="°C"
          :min24h="heatMin24"
          :max24h="heatMax24"
          colorClass="bg-orange-500"
        />
      </div>

      <!-- Right Column: Chart -->
      <div class="lg:col-span-8 flex flex-col">
        <div class="flex-1 min-h-[400px]">
           <ConditionChart :chartData="chartData" />
        </div>
      </div>

    </div>
  </div>
</template>
