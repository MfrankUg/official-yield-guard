<script setup>
import { computed, ref } from 'vue'
import MetricCard from '../components/MetricCard.vue'
import ConditionChart from '../components/ConditionChart.vue'
import { Thermometer, Droplet, Download, FileText, Database } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'
import { useExport } from '../composables/useExport'

const { 
  currentTemperature, 
  currentHumidity, 
  historicalDataPoints,
  isConnected
} = useMQTT()

const { downloadCSV, downloadPDF } = useExport()

const exportTimeframe = ref('1day')
const isExportMenuOpen = ref(false)

const handleExport = (format) => {
  if (format === 'csv') {
    downloadCSV(exportTimeframe.value, 'Dashboard_Environment_Report')
  } else if (format === 'pdf') {
    downloadPDF(exportTimeframe.value, 'Dashboard_Environment_Report')
  }
  isExportMenuOpen.value = false
}

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

// Warning logic based on optimal coffee storage
const tempWarning = computed(() => {
  if (currentTemperature.value === null) return false
  return currentTemperature.value > 24 || currentTemperature.value < 15
})

const humWarning = computed(() => {
  if (currentHumidity.value === null) return false
  return currentHumidity.value > 65 || currentHumidity.value < 40
})

</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[calc(100vh-10rem)]">
      
      <!-- Left Column: Metric Cards -->
      <div class="lg:col-span-4 flex flex-col space-y-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-content-primary flex items-center">
            Live Sensors
            <span 
              class="w-2.5 h-2.5 rounded-full ml-3 shadow-sm"
              :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-[var(--color-accent-red)]'"
              :title="isConnected ? 'System Live' : 'System Offline'"
            ></span>
          </h2>
          
          <!-- Export Dropdown -->
          <div class="relative">
            <button 
              @click="isExportMenuOpen = !isExportMenuOpen"
              class="flex items-center px-3 py-1.5 text-xs font-medium text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 border border-[var(--color-accent-blue)]/20 rounded-lg hover:bg-[var(--color-accent-blue)]/20 transition-colors"
            >
              <Download class="w-3.5 h-3.5 mr-1.5" />
              Export
            </button>
            
            <div 
              v-if="isExportMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-base-secondary rounded-xl border border-border-soft shadow-2xl z-50 overflow-hidden"
            >
              <div class="p-3 border-b border-border-soft">
                <label class="block text-xs font-medium text-content-secondary mb-1">Timeframe</label>
                <select 
                  v-model="exportTimeframe"
                  class="w-full bg-base-primary border border-border-soft rounded-lg px-2 py-1.5 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)]"
                >
                  <option value="1day">Last 24 Hours</option>
                  <option value="1week">Last 7 Days</option>
                  <option value="1month">Last 30 Days</option>
                </select>
              </div>
              <div class="p-2 space-y-1">
                <button 
                  @click="handleExport('csv')"
                  class="w-full flex items-center px-3 py-2 text-sm text-content-primary hover:bg-base-primary rounded-lg transition-colors"
                >
                  <Database class="w-4 h-4 mr-2 text-[var(--color-accent-blue)]" />
                  Download CSV
                </button>
                <button 
                  @click="handleExport('pdf')"
                  class="w-full flex items-center px-3 py-2 text-sm text-content-primary hover:bg-base-primary rounded-lg transition-colors"
                >
                  <FileText class="w-4 h-4 mr-2 text-[var(--color-accent-red)]" />
                  Download PDF
                </button>
              </div>
            </div>
            
            <!-- Backdrop -->
            <div 
              v-if="isExportMenuOpen" 
              @click="isExportMenuOpen = false" 
              class="fixed inset-0 z-40"
            ></div>
          </div>
        </div>
        <MetricCard 
          title="Air Temperature"
          :icon="Thermometer"
          :value="currentTemperature"
          unit="°C"
          :min24h="tempMin24"
          :max24h="tempMax24"
          colorClass="bg-[var(--color-accent-blue)]"
          :warning="tempWarning"
        />
        <MetricCard 
          title="Relative Humidity"
          :icon="Droplet"
          :value="currentHumidity"
          unit="%"
          :min24h="humMin24"
          :max24h="humMax24"
          colorClass="bg-[var(--color-accent-red)]"
          :warning="humWarning"
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
