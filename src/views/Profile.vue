<script setup>
import { ref, onMounted } from 'vue'
import { User, Mail, Phone, Save, Loader2, ArrowLeft } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useProfile } from '../composables/useProfile'
import { useLanguage } from '../composables/useLanguage'
import { useRouter } from 'vue-router'

const { user } = useAuth()
const { loading, getProfile, updateProfile } = useProfile()
const { t } = useLanguage()
const router = useRouter()

const profile = ref({
  full_name: '',
  phone: ''
})

const isSaving = ref(false)
const message = ref({ type: '', text: '' })

onMounted(async () => {
  if (user.value) {
    const data = await getProfile(user.value.id)
    if (data) {
      profile.value = data
    }
  }
})

const handleSave = async () => {
  isSaving.value = true
  message.value = { type: '', text: '' }
  
  const success = await updateProfile(user.value.id, {
    full_name: profile.value.full_name,
    phone: profile.value.phone
  })
  
  if (success) {
    message.value = { type: 'success', text: t('profile.success') }
    setTimeout(() => {
      message.value = { type: '', text: '' }
    }, 3000)
  } else {
    message.value = { type: 'error', text: t('profile.error') }
  }
  
  isSaving.value = false
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6 lg:space-y-8 pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button 
        @click="goBack"
        class="flex items-center text-content-secondary hover:text-content-primary transition-colors group"
      >
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {{ t('profile.back') }}
      </button>
    </div>

    <!-- Profile Card -->
    <div class="bg-base-secondary rounded-3xl border border-border-soft shadow-xl overflow-hidden relative">
      <!-- Decoration -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--color-accent-blue)]/20 to-[var(--color-accent-green)]/10"></div>
      
      <div class="p-8 pt-16 relative">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-24 h-24 rounded-full bg-[var(--color-accent-blue)] border-4 border-base-secondary shadow-lg flex items-center justify-center mb-4">
            <User class="w-12 h-12 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-content-primary">{{ t('profile.title') }}</h2>
          <p class="text-sm text-content-secondary mt-1">{{ t('profile.subtitle') }}</p>
        </div>

        <!-- Form -->
        <div class="space-y-6">
          <!-- Email (Read-only) -->
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">{{ t('profile.email') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-content-secondary/50" />
              </div>
              <input 
                type="email" 
                :value="user?.email" 
                readonly
                class="block w-full pl-11 pr-4 py-3 bg-base-primary/50 border border-border-soft rounded-2xl text-content-secondary cursor-not-allowed text-sm"
              />
            </div>
            <p class="text-[10px] text-content-secondary/60 mt-1.5 ml-1 italic">{{ t('profile.emailSub') }}</p>
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">{{ t('profile.fullName') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-content-secondary" />
              </div>
              <input 
                v-model="profile.full_name"
                type="text" 
                :placeholder="t('profile.fullNamePlaceholder')"
                class="block w-full pl-11 pr-4 py-3 bg-base-primary border border-border-soft rounded-2xl text-content-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] focus:border-transparent transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-2">{{ t('profile.phone') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone class="h-5 w-5 text-content-secondary" />
              </div>
              <input 
                v-model="profile.phone"
                type="tel" 
                :placeholder="t('profile.phonePlaceholder')"
                class="block w-full pl-11 pr-4 py-3 bg-base-primary border border-border-soft rounded-2xl text-content-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] focus:border-transparent transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          <!-- Message -->
          <div v-if="message.text" :class="[
            'p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300',
            message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          ]">
            {{ message.text }}
          </div>

          <!-- Save Button -->
          <button 
            @click="handleSave"
            :disabled="isSaving"
            class="w-full flex items-center justify-center px-6 py-4 bg-[var(--color-accent-blue)] text-white rounded-2xl text-base font-semibold hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <Loader2 v-if="isSaving" class="w-5 h-5 mr-2 animate-spin" />
            <Save v-else class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {{ isSaving ? t('profile.saving') : t('profile.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

