<script setup>
import { computed } from 'vue'
import { Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'
import ConditionChart from '../components/ConditionChart.vue'

const { historicalDataPoints, notifications } = useMQTT()

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

</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 lg:space-y-8">
    
    <!-- Header -->
    <div class="bg-base-secondary p-6 rounded-2xl border border-border-soft shadow-sm flex items-center space-x-4">
      <div class="w-12 h-12 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center shrink-0">
        <Activity class="w-6 h-6 text-[var(--color-accent-blue)]" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-content-primary">System History</h2>
        <p class="text-sm text-content-secondary">Historical logs and environmental trends</p>
      </div>
    </div>

    <!-- Main Chart -->
    <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-content-primary">72-Hour Condition Trends</h3>
        <div class="px-3 py-1 bg-base-primary rounded-lg border border-border-soft text-xs text-content-secondary font-medium flex items-center">
          <Clock class="w-3 h-3 mr-1.5" />
          Live Updating
        </div>
      </div>
      <div class="h-[400px] w-full">
        <ConditionChart :chartData="chartData" />
      </div>
    </div>

    <!-- Alert Log -->
    <div class="bg-base-secondary rounded-2xl border border-border-soft shadow-sm overflow-hidden">
      <div class="p-6 border-b border-border-soft flex justify-between items-center bg-base-secondary">
        <h3 class="text-lg font-bold text-content-primary">Alert Event Log</h3>
        <span class="text-sm font-medium text-[var(--color-accent-blue)]">{{ notifications.length }} Records</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-base-primary/50 text-xs text-content-secondary uppercase tracking-wider border-b border-border-soft">
              <th class="px-6 py-4 font-medium">Time</th>
              <th class="px-6 py-4 font-medium">Event Type</th>
              <th class="px-6 py-4 font-medium">Message</th>
            </tr>
          </thead>
          <tbody v-if="notifications.length > 0">
            <tr 
              v-for="note in notifications" 
              :key="note.id"
              class="border-b border-border-soft last:border-0 hover:bg-base-primary/30 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-content-secondary whitespace-nowrap">{{ note.time }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] border border-[var(--color-accent-red)]/20">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  System Alert
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-content-primary font-medium">{{ note.message }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="px-6 py-12 text-center text-content-secondary">
                <div class="flex flex-col items-center justify-center">
                  <CheckCircle2 class="w-10 h-10 text-green-500/50 mb-3" />
                  <p class="text-sm">No historical alerts recorded. Systems have remained optimal.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
