<script setup>
import { ref, computed } from 'vue'
import { MapPin, Box, Thermometer, Droplet, AlertTriangle } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'
import { useLanguage } from '../composables/useLanguage'

const { currentTemperature, currentHumidity } = useMQTT()
const { t } = useLanguage()

const selectedZone = ref('zone-a')

const zones = computed(() => [
  { id: 'zone-a', name: t('map.zoneA.name'), color: 'border-[var(--color-accent-blue)]' },
  { id: 'zone-b', name: t('map.zoneB.name'), color: 'border-green-500' },
  { id: 'zone-c', name: t('map.zoneC.name'), color: 'border-[var(--color-accent-red)]' }
])

const activeZoneData = computed(() => {
  if (selectedZone.value === 'zone-a') {
    return {
      temp: currentTemperature.value !== null ? currentTemperature.value : '--',
      hum: currentHumidity.value !== null ? currentHumidity.value : '--',
      status: currentTemperature.value !== null ? t('map.liveData') : t('map.waitingData')
    }
  } else {
    return {
      temp: '--',
      hum: '--',
      status: t('map.offline')
    }
  }
})

const getZoneClass = (zoneId) => {
  const isSelected = selectedZone.value === zoneId
  let baseClass = 'rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center p-6 min-h-[150px] '
  
  if (isSelected) {
    if (zoneId === 'zone-a') baseClass += 'bg-[var(--color-accent-blue)]/20 border-[var(--color-accent-blue)] ring-4 ring-[var(--color-accent-blue)]/30'
    else if (zoneId === 'zone-b') baseClass += 'bg-green-500/20 border-green-500 ring-4 ring-green-500/30'
    else if (zoneId === 'zone-c') baseClass += 'bg-[var(--color-accent-red)]/20 border-[var(--color-accent-red)] ring-4 ring-[var(--color-accent-red)]/30'
  } else {
    baseClass += 'bg-base-secondary border-border-soft hover:bg-base-primary/50'
  }
  
  return baseClass
}

</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 lg:space-y-8">
    
    <!-- Header & Dropdown -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-secondary p-6 rounded-2xl border border-border-soft shadow-sm">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center">
          <MapPin class="w-5 h-5 text-[var(--color-accent-blue)]" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-content-primary">{{ t('map.title') }}</h2>
          <p class="text-sm text-content-secondary">{{ t('map.sub') }}</p>
        </div>
      </div>
      
      <div class="w-full sm:w-64">
        <label class="block text-xs font-medium text-content-secondary mb-1">{{ t('map.selectZone') }}</label>
        <select 
          v-model="selectedZone"
          class="w-full bg-base-primary border border-border-soft rounded-xl px-4 py-2.5 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-colors cursor-pointer appearance-none"
        >
          <option v-for="zone in zones" :key="zone.id" :value="zone.id">
            {{ zone.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Zone Summary Bar -->
    <div class="bg-base-secondary border border-border-soft rounded-2xl p-4 sm:p-6 shadow-sm flex flex-wrap items-center gap-6 sm:gap-12">
      <div class="flex items-center space-x-3">
        <div class="w-2 h-2 rounded-full" :class="activeZoneData.temp !== '--' ? 'bg-green-500 animate-pulse' : 'bg-content-secondary'"></div>
        <div>
          <p class="text-[10px] uppercase tracking-wider font-bold text-content-secondary">{{ zones.find(z => z.id === selectedZone)?.name }} Status</p>
          <p class="text-sm font-bold text-content-primary">{{ activeZoneData.status }}</p>
        </div>
      </div>

      <div class="h-8 w-px bg-border-soft hidden sm:block"></div>

      <div class="flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-[var(--color-accent-blue)]/10">
          <Thermometer class="w-4 h-4 text-[var(--color-accent-blue)]" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-wider font-bold text-content-secondary">{{ t('card.temperature') }}</p>
          <p class="text-sm font-bold text-content-primary">{{ activeZoneData.temp }}°C</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-[var(--color-accent-red)]/10">
          <Droplet class="w-4 h-4 text-[var(--color-accent-red)]" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-wider font-bold text-content-secondary">{{ t('card.humidity') }}</p>
          <p class="text-sm font-bold text-content-primary">{{ activeZoneData.hum }}%</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-6 lg:gap-8">
      
      <!-- Interactive Floorplan -->
      <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm">
        <h3 class="text-lg font-bold text-content-primary mb-6">{{ t('map.floorplan') }}</h3>
        
        <!-- CSS Grid Map representation -->
        <div class="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] sm:h-[500px]">
          <!-- Zone A -->
          <div 
            @click="selectedZone = 'zone-a'"
            :class="getZoneClass('zone-a') + ' col-span-2 relative overflow-hidden'"
          >
            <div class="absolute top-4 right-4 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span class="text-xs font-medium text-content-secondary">{{ t('map.activeSensor') }}</span>
            </div>
            <Box class="w-8 h-8 mb-3 opacity-80" :class="selectedZone === 'zone-a' ? 'text-[var(--color-accent-blue)]' : 'text-content-secondary'" />
            <span class="font-bold text-lg text-content-primary tracking-wide">ZONE A</span>
            <span class="text-sm text-content-secondary mt-1">{{ t('map.zoneA.sub') }}</span>
          </div>
          
          <!-- Zone B -->
          <div 
            @click="selectedZone = 'zone-b'"
            :class="getZoneClass('zone-b')"
          >
            <Box class="w-8 h-8 mb-3 opacity-80" :class="selectedZone === 'zone-b' ? 'text-green-500' : 'text-content-secondary'" />
            <span class="font-bold text-lg text-content-primary tracking-wide">ZONE B</span>
            <span class="text-sm text-content-secondary mt-1">{{ t('map.zoneB.sub') }}</span>
          </div>

          <!-- Zone C -->
          <div 
            @click="selectedZone = 'zone-c'"
            :class="getZoneClass('zone-c')"
          >
            <Box class="w-8 h-8 mb-3 opacity-80" :class="selectedZone === 'zone-c' ? 'text-[var(--color-accent-red)]' : 'text-content-secondary'" />
            <span class="font-bold text-lg text-content-primary tracking-wide">ZONE C</span>
            <span class="text-sm text-content-secondary mt-1 text-center">{{ t('map.zoneC.sub') }}</span>
          </div>
        </div>
      </div>

      <!-- Realtime Location Map -->
      <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-content-primary">{{ t('map.geoLocation') }}</h3>
          <span class="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5"></span>
            {{ t('map.liveGPS') }}
          </span>
        </div>
        <div class="h-[400px] w-full rounded-xl overflow-hidden border border-border-soft bg-base-primary">
          <!-- Using OpenStreetMap with a CSS filter to create a beautiful dark mode map -->
          <iframe 
            width="100%" 
            height="100%" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=29.9%2C0.2%2C30.2%2C0.4&amp;layer=mapnik&amp;marker=0.30%2C30.05" 
            style="border: 0; filter: invert(90%) hue-rotate(180deg) contrast(85%);" 
          ></iframe>
        </div>
      </div>

    </div>
  </div>
</template>
