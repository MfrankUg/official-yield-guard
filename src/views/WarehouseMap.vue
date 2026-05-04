<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, Box, Thermometer, Droplet, Flame } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'
import MetricCard from '../components/MetricCard.vue'

const { currentTemperature, currentHumidity, currentHeatIndex } = useMQTT()

const selectedZone = ref('zone-a')

const zones = [
  { id: 'zone-a', name: 'Zone A: Main Coffee Storage', color: 'border-[var(--color-accent-blue)]' },
  { id: 'zone-b', name: 'Zone B: Sorting & Processing', color: 'border-green-500' },
  { id: 'zone-c', name: 'Zone C: Packaging', color: 'border-[var(--color-accent-red)]' }
]

const activeZoneData = computed(() => {
  if (selectedZone.value === 'zone-a') {
    return {
      temp: currentTemperature.value !== null ? currentTemperature.value : '--',
      hum: currentHumidity.value !== null ? currentHumidity.value : '--',
      heat: currentHeatIndex.value !== null ? currentHeatIndex.value : '--',
      status: currentTemperature.value !== null ? 'Live Data' : 'Waiting for data...'
    }
  } else {
    return {
      temp: '--',
      hum: '--',
      heat: '--',
      status: 'Offline / No Sensor'
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
          <h2 class="text-xl font-bold text-content-primary">Warehouse Map</h2>
          <p class="text-sm text-content-secondary">Facility Overview & Zone Monitoring</p>
        </div>
      </div>
      
      <div class="w-full sm:w-64">
        <label class="block text-xs font-medium text-content-secondary mb-1">Select Zone</label>
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

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      
      <!-- Left Column: Maps -->
      <div class="xl:col-span-2 flex flex-col space-y-6 lg:space-y-8">
        
        <!-- Interactive Floorplan -->
        <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm">
          <h3 class="text-lg font-bold text-content-primary mb-6">Interactive Floorplan</h3>
          
          <!-- CSS Grid Map representation -->
          <div class="grid grid-cols-2 grid-rows-2 gap-4 h-[400px]">
            <!-- Zone A -->
            <div 
              @click="selectedZone = 'zone-a'"
              :class="getZoneClass('zone-a') + ' col-span-2 relative overflow-hidden'"
            >
              <div class="absolute top-4 right-4 flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span class="text-xs font-medium text-content-secondary">Active Sensor</span>
              </div>
              <Box class="w-8 h-8 mb-3 opacity-80" :class="selectedZone === 'zone-a' ? 'text-[var(--color-accent-blue)]' : 'text-content-secondary'" />
              <span class="font-bold text-lg text-content-primary tracking-wide">ZONE A</span>
              <span class="text-sm text-content-secondary mt-1">Main Coffee Storage</span>
            </div>
            
            <!-- Zone B -->
            <div 
              @click="selectedZone = 'zone-b'"
              :class="getZoneClass('zone-b')"
            >
              <Box class="w-8 h-8 mb-3 opacity-80" :class="selectedZone === 'zone-b' ? 'text-green-500' : 'text-content-secondary'" />
              <span class="font-bold text-lg text-content-primary tracking-wide">ZONE B</span>
              <span class="text-sm text-content-secondary mt-1">Sorting & Processing</span>
            </div>

            <!-- Zone C -->
            <div 
              @click="selectedZone = 'zone-c'"
              :class="getZoneClass('zone-c')"
            >
              <div class="absolute top-4 right-4 flex items-center space-x-2" v-if="selectedZone !== 'zone-c'">
              </div>
              <Box class="w-8 h-8 mb-3 opacity-80" :class="selectedZone === 'zone-c' ? 'text-[var(--color-accent-red)]' : 'text-content-secondary'" />
              <span class="font-bold text-lg text-content-primary tracking-wide">ZONE C</span>
              <span class="text-sm text-content-secondary mt-1 text-center">Packaging</span>
            </div>
          </div>
        </div>

        <!-- Realtime Location Map -->
        <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-content-primary">Geographic Location</h3>
            <span class="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5"></span>
              Live GPS Tracking
            </span>
          </div>
          <div class="h-[300px] w-full rounded-xl overflow-hidden border border-border-soft bg-base-primary">
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

      <!-- Right: Zone Details -->
      <div class="flex flex-col space-y-6">
        <div class="bg-base-secondary rounded-2xl border border-border-soft p-6 shadow-sm flex-1">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-lg font-bold text-content-primary">{{ zones.find(z => z.id === selectedZone)?.name }}</h3>
              <p class="text-xs font-medium px-2 py-1 bg-base-primary rounded text-content-secondary mt-2 inline-block">
                {{ activeZoneData.status }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <MetricCard 
              title="Temperature"
              :icon="Thermometer"
              :value="activeZoneData.temp"
              unit="°C"
              min24h="--"
              max24h="--"
              colorClass="bg-[var(--color-accent-blue)]"
            />
            <MetricCard 
              title="Humidity"
              :icon="Droplet"
              :value="activeZoneData.hum"
              unit="%"
              min24h="--"
              max24h="--"
              colorClass="bg-[var(--color-accent-red)]"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
