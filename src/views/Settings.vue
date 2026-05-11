<script setup>
import { ref } from 'vue'
import { Settings as SettingsIcon, Save, Bell, Sliders, Cpu } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

const thresholds = ref({
  maxTemp: 25.0,
  minTemp: 15.0,
  maxHum: 65.0,
  minHum: 50.0
})

const notifications = ref({
  pushEnabled: true,
  emailEnabled: false
})

const aiConfig = ref({
  model: 'llama3',
  endpoint: 'http://localhost:11434/api/chat'
})

const isSaving = ref(false)
const isSaved = ref(false)

const saveSettings = () => {
  isSaving.value = true
  isSaved.value = false
  
  // Simulate network request
  setTimeout(() => {
    isSaving.value = false
    isSaved.value = true
    
    // reset saved state after 3s
    setTimeout(() => {
      isSaved.value = false
    }, 3000)
  }, 800)
}

</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 lg:space-y-8 pb-12">
    
    <!-- Header -->
    <div class="bg-base-secondary p-6 rounded-2xl border border-border-soft shadow-sm flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center shrink-0">
          <SettingsIcon class="w-6 h-6 text-[var(--color-accent-blue)]" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-content-primary">{{ t('settings.title') }}</h2>
          <p class="text-sm text-content-secondary">{{ t('settings.sub') }}</p>
        </div>
      </div>
      
      <button 
        @click="saveSettings"
        :disabled="isSaving"
        class="hidden sm:flex items-center px-6 py-2.5 bg-[var(--color-accent-blue)] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-70"
      >
        <Save class="w-4 h-4 mr-2" />
        {{ isSaving ? t('settings.saving') : (isSaved ? t('settings.saved') : t('settings.save')) }}
      </button>
    </div>

    <!-- Threshold Settings -->
    <div class="bg-base-secondary rounded-2xl border border-border-soft shadow-sm overflow-hidden">
      <div class="p-6 border-b border-border-soft flex items-center bg-base-primary/30">
        <Sliders class="w-5 h-5 text-content-secondary mr-3" />
        <h3 class="text-lg font-bold text-content-primary">{{ t('settings.thresholds') }}</h3>
      </div>
      <div class="p-6">
        <p class="text-sm text-content-secondary mb-6 leading-relaxed">
          {{ t('settings.thresholdsSub') }}
        </p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">Maximum Temperature (°C)</label>
            <input type="number" step="0.1" v-model="thresholds.maxTemp" class="w-full bg-base-primary border border-border-soft rounded-xl px-4 py-3 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">Minimum Temperature (°C)</label>
            <input type="number" step="0.1" v-model="thresholds.minTemp" class="w-full bg-base-primary border border-border-soft rounded-xl px-4 py-3 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">Maximum Humidity (%)</label>
            <input type="number" step="0.1" v-model="thresholds.maxHum" class="w-full bg-base-primary border border-border-soft rounded-xl px-4 py-3 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">Minimum Humidity (%)</label>
            <input type="number" step="0.1" v-model="thresholds.minHum" class="w-full bg-base-primary border border-border-soft rounded-xl px-4 py-3 text-sm text-content-primary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-colors" />
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-base-secondary rounded-2xl border border-border-soft shadow-sm overflow-hidden">
      <div class="p-6 border-b border-border-soft flex items-center bg-base-primary/30">
        <Bell class="w-5 h-5 text-content-secondary mr-3" />
        <h3 class="text-lg font-bold text-content-primary">{{ t('settings.alerts') }}</h3>
      </div>
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-content-primary">Browser Push Notifications</h4>
            <p class="text-xs text-content-secondary mt-1">Receive desktop alerts when thresholds are breached.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="notifications.pushEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-base-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-blue)] border border-border-soft"></div>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-content-primary">Email Notifications</h4>
            <p class="text-xs text-content-secondary mt-1">Send an email report for critical alerts.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="notifications.emailEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-base-primary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-blue)] border border-border-soft"></div>
          </label>
        </div>
      </div>
    </div>



    <!-- Mobile Save Button -->
    <button 
      @click="saveSettings"
      :disabled="isSaving"
      class="sm:hidden w-full flex items-center justify-center px-6 py-4 bg-[var(--color-accent-blue)] text-white rounded-xl text-base font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-70 mt-6"
    >
      <Save class="w-5 h-5 mr-2" />
      {{ isSaving ? t('settings.saving') : (isSaved ? t('settings.saved') : t('settings.save')) }}
    </button>

  </div>
</template>
