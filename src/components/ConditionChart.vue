<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useLanguage } from '../composables/useLanguage'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const { t } = useLanguage()

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#8b949e',
        usePointStyle: true,
        boxWidth: 8,
        font: {
          family: "'Inter', sans-serif",
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: '#151a28',
      titleColor: '#ffffff',
      bodyColor: '#8b949e',
      borderColor: '#1f2937',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      boxPadding: 4,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(1);
            if (context.dataset.yAxisID === 'y') label += '°C';
            if (context.dataset.yAxisID === 'y1') label += '%';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#1f2937',
        drawBorder: false,
      },
      ticks: {
        color: '#8b949e',
        font: {
          family: "'Inter', sans-serif"
        }
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: '#1f2937',
        drawBorder: false,
      },
      ticks: {
        color: '#8b949e',
        callback: function(value) {
          return Number(value).toFixed(1) + '°C';
        }
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
      ticks: {
        color: '#8b949e',
        callback: function(value) {
          return Number(value).toFixed(1) + '%';
        }
      }
    }
  }
}
</script>

<template>
  <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-content-primary font-semibold">{{ t('chart.title') }}</h3>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-[var(--color-accent-blue)]"></span>
        <span class="text-xs text-content-secondary">{{ t('chart.temp') }}</span>
        <span class="w-3 h-3 rounded-full bg-[var(--color-accent-red)] ml-3"></span>
        <span class="text-xs text-content-secondary">{{ t('chart.humidity') }}</span>
      </div>
    </div>
    <div class="flex-1 relative">
      <Line :data="chartData" :options="options" />
    </div>
  </div>
</template>
