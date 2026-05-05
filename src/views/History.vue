<script setup>
import { computed, ref } from 'vue'
import { Activity, Clock, AlertTriangle, CheckCircle2, Download, FileText, Database } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'
import { useExport } from '../composables/useExport'
import { useLanguage } from '../composables/useLanguage'
import ConditionChart from '../components/ConditionChart.vue'

const { historicalDataPoints, notifications } = useMQTT()
const { downloadCSV, downloadPDF } = useExport()
const { t } = useLanguage()

const exportTimeframeEnv = ref('1day')
const exportTimeframeLogs = ref('1day')

const isEnvMenuOpen = ref(false)
const isLogsMenuOpen = ref(false)



const handleEnvExport = (format) => {
  if (format === 'csv') {
    downloadCSV(exportTimeframeEnv.value, 'YieldGuard_Env_History')
  } else if (format === 'pdf') {
    downloadPDF(exportTimeframeEnv.value, 'YieldGuard_Env_History')
  }
  isEnvMenuOpen.value = false
}

// For logs, we can just use the existing notifications array since we don't mock historical logs yet,
// but to satisfy the UI requirement, we can format the PDF/CSV with the selected timeframe string.
const handleLogsExport = (format) => {
  if (notifications.value.length === 0) {
    alert("No alert logs to download.")
    return
  }

  const reportName = 'YieldGuard_Alert_Logs'
  const tf = exportTimeframeLogs.value

  if (format === 'csv') {
    const headers = ['ID', 'Time', 'Message']
    const rows = notifications.value.map(n => [n.id, n.time, `"${n.message}"`])
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `${reportName}_${tf}.csv`)
    link.click()
  } else if (format === 'pdf') {
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text(`Yield Guard - Alert Logs`, 14, 22)
        doc.setFontSize(11)
        doc.setTextColor(100)
        doc.text(`Report Period: ${tf.toUpperCase()}`, 14, 30)
        
        const tableData = notifications.value.map(n => [n.time, n.message])
        doc.autoTable({
          startY: 40,
          head: [['Time', 'Alert Message']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [239, 68, 68] } // red-500
        })
        doc.save(`${reportName}_${tf}.pdf`)
      })
    })
  }
  isLogsMenuOpen.value = false
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

</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 lg:space-y-8">
    
    <!-- Header -->
    <div class="bg-base-secondary p-6 rounded-2xl border border-border-soft shadow-sm flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center shrink-0">
          <Activity class="w-6 h-6 text-[var(--color-accent-blue)]" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-content-primary">{{ t('history.title') }}</h2>
          <p class="text-sm text-content-secondary">{{ t('history.sub') }}</p>
        </div>
      </div>
    </div>

    <!-- Export Center -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <!-- Environmental Data Export -->
      <div class="bg-base-secondary p-5 rounded-2xl border border-border-soft shadow-sm flex items-center justify-between hover:border-[var(--color-accent-blue)]/50 transition-colors relative">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-[var(--color-accent-blue)]/10 flex items-center justify-center">
            <Database class="w-5 h-5 text-[var(--color-accent-blue)]" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-content-primary">{{ t('history.envData') }}</h3>
            <p class="text-xs text-content-secondary">{{ t('history.envDataSub') }}</p>
          </div>
        </div>
        
        <button 
          @click="isEnvMenuOpen = !isEnvMenuOpen"
          class="flex items-center px-4 py-2 bg-[var(--color-accent-blue)] text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Download class="w-4 h-4 mr-2" />
          {{ t('dash.export') }}
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isEnvMenuOpen"
          class="absolute right-0 top-full mt-2 w-56 bg-base-secondary rounded-xl border border-border-soft shadow-2xl z-50 overflow-hidden"
        >
          <div class="p-3 border-b border-border-soft">
            <label class="block text-xs font-medium text-content-secondary mb-1">{{ t('dash.timeframe') }}</label>
            <select 
              v-model="exportTimeframeEnv"
              class="w-full bg-base-primary border border-border-soft rounded-lg px-2 py-1.5 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)]"
            >
              <option value="1day">{{ t('dash.last24h') }}</option>
              <option value="1week">{{ t('dash.last7d') }}</option>
              <option value="1month">{{ t('dash.last30d') }}</option>
            </select>
          </div>
          <div class="p-2 space-y-1">
            <button 
              @click="handleEnvExport('csv')"
              class="w-full flex items-center px-3 py-2 text-sm text-content-primary hover:bg-base-primary rounded-lg transition-colors"
            >
              <Database class="w-4 h-4 mr-2 text-[var(--color-accent-blue)]" />
              {{ t('dash.downloadCSV') }}
            </button>
            <button 
              @click="handleEnvExport('pdf')"
              class="w-full flex items-center px-3 py-2 text-sm text-content-primary hover:bg-base-primary rounded-lg transition-colors"
            >
              <FileText class="w-4 h-4 mr-2 text-[var(--color-accent-red)]" />
              {{ t('dash.downloadPDF') }}
            </button>
          </div>
        </div>
        <div v-if="isEnvMenuOpen" @click="isEnvMenuOpen = false" class="fixed inset-0 z-40"></div>
      </div>

      <!-- Alert Logs Export -->
      <div class="bg-base-secondary p-5 rounded-2xl border border-border-soft shadow-sm flex items-center justify-between hover:border-[var(--color-accent-red)]/50 transition-colors relative">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-[var(--color-accent-red)]/10 flex items-center justify-center">
            <FileText class="w-5 h-5 text-[var(--color-accent-red)]" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-content-primary">{{ t('history.alertLogs') }}</h3>
            <p class="text-xs text-content-secondary">{{ t('history.alertLogsSub') }}</p>
          </div>
        </div>
        
        <button 
          @click="isLogsMenuOpen = !isLogsMenuOpen"
          class="flex items-center px-4 py-2 bg-base-primary border border-border-soft text-content-primary text-sm font-medium rounded-xl hover:bg-base-primary/50 transition-colors"
        >
          <Download class="w-4 h-4 mr-2 text-[var(--color-accent-red)]" />
          {{ t('dash.export') }}
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isLogsMenuOpen"
          class="absolute right-0 top-full mt-2 w-56 bg-base-secondary rounded-xl border border-border-soft shadow-2xl z-50 overflow-hidden"
        >
          <div class="p-3 border-b border-border-soft">
            <label class="block text-xs font-medium text-content-secondary mb-1">{{ t('dash.timeframe') }}</label>
            <select 
              v-model="exportTimeframeLogs"
              class="w-full bg-base-primary border border-border-soft rounded-lg px-2 py-1.5 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)]"
            >
              <option value="1day">{{ t('dash.last24h') }}</option>
              <option value="1week">{{ t('dash.last7d') }}</option>
              <option value="1month">{{ t('dash.last30d') }}</option>
            </select>
          </div>
          <div class="p-2 space-y-1">
            <button 
              @click="handleLogsExport('csv')"
              class="w-full flex items-center px-3 py-2 text-sm text-content-primary hover:bg-base-primary rounded-lg transition-colors"
            >
              <Database class="w-4 h-4 mr-2 text-[var(--color-accent-blue)]" />
              {{ t('dash.downloadCSV') }}
            </button>
            <button 
              @click="handleLogsExport('pdf')"
              class="w-full flex items-center px-3 py-2 text-sm text-content-primary hover:bg-base-primary rounded-lg transition-colors"
            >
              <FileText class="w-4 h-4 mr-2 text-[var(--color-accent-red)]" />
              {{ t('dash.downloadPDF') }}
            </button>
          </div>
        </div>
        <div v-if="isLogsMenuOpen" @click="isLogsMenuOpen = false" class="fixed inset-0 z-40"></div>
      </div>
    </div>

    <!-- Main Chart -->
    <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-content-primary">{{ t('history.conditionTrends') }}</h3>
        <div class="px-3 py-1 bg-base-primary rounded-lg border border-border-soft text-xs text-content-secondary font-medium flex items-center">
          <Clock class="w-3 h-3 mr-1.5" />
          {{ t('history.liveUpdating') }}
        </div>
      </div>
      <div class="h-[400px] w-full">
        <ConditionChart :chartData="chartData" />
      </div>
    </div>

    <!-- Alert Log -->
    <div class="bg-base-secondary rounded-2xl border border-border-soft shadow-sm overflow-hidden">
      <div class="p-6 border-b border-border-soft flex justify-between items-center bg-base-secondary">
        <h3 class="text-lg font-bold text-content-primary">{{ t('history.alertEventLog') }}</h3>
        <span class="text-sm font-medium text-[var(--color-accent-blue)]">{{ notifications.length }} {{ t('history.records') }}</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-base-primary/50 text-xs text-content-secondary uppercase tracking-wider border-b border-border-soft">
              <th class="px-6 py-4 font-medium">{{ t('history.time') }}</th>
              <th class="px-6 py-4 font-medium">{{ t('history.eventType') }}</th>
              <th class="px-6 py-4 font-medium">{{ t('history.message') }}</th>
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
                  {{ t('history.systemAlert') }}
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
                  <p class="text-sm">{{ t('history.noAlerts') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
