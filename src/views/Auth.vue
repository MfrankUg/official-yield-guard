<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Mail, Lock, User, CheckCircle2 } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'
import { useAuth } from '../composables/useAuth'

const { signUp, signIn } = useAuth()
const { t } = useLanguage()
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()
const route = useRoute()

// Determine initial mode from route
const authMode = ref(route.path === '/signup' ? 'signup' : 'login')

// Form states
const email = ref('')
const password = ref('')
const name = ref('')

const isLoading = ref(false)

const handleAuth = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    if (authMode.value === 'signup') {
      await signUp(email.value, password.value)
      successMessage.value = 'Registration successful! Please check your email for confirmation.'
      // Optionally stay on page or auto-login if email confirm is disabled
    } else if (authMode.value === 'login') {
      await signIn(email.value, password.value)
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Auth error:', error)
    errorMessage.value = error.message || 'An error occurred during authentication.'
  } finally {
    isLoading.value = false
  }
}

const navigateBack = () => {
  router.push('/')
}

const toggleMode = (mode) => {
  authMode.value = mode
  // Optionally update URL without reloading
  if (mode === 'login' && route.path !== '/login') router.replace('/login')
  if (mode === 'signup' && route.path !== '/signup') router.replace('/signup')
}
</script>

<template>
  <div class="flex min-h-full w-full bg-white font-sans">
    
    <!-- Left Side: Visual Branding (Hidden on Mobile) -->
    <div class="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden bg-black">
      <!-- Safe Coffee Image Background -->
      <img src="../assets/Safe-Coffee.jpg" class="absolute inset-0 w-full h-full object-cover z-0 opacity-70 grayscale-[20%]" alt="Yield Guard Safe Coffee" />
      
      <!-- Professional Dark Overlay for Text Readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#0A1930]/90 via-[#0A1930]/40 to-[#0A1930]/60 z-0 pointer-events-none mix-blend-multiply"></div>
      <div class="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>

      <!-- Top Back Button -->
      <div class="relative z-10 p-8">
        <button @click="navigateBack" class="flex items-center text-white/80 hover:text-white transition-colors group bg-black/20 hover:bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 w-max">
          <ArrowLeft class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium text-sm">{{ t('auth.back') }}</span>
        </button>
      </div>

      <!-- Center Logo & Branding -->
      <div class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div class="flex flex-col items-center pointer-events-auto cursor-pointer hover:opacity-90 transition-opacity hover:scale-105 duration-300" @click="navigateBack">
          <div class="relative">
             <div class="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
             <img src="../assets/logo.png" alt="Yield Guard Logo" class="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl p-1.5 bg-white/10 backdrop-blur-md mb-6 relative z-10" />
          </div>
          <span class="text-5xl font-extrabold tracking-tight text-white drop-shadow-2xl">Yield Guard</span>
          <span class="text-blue-200/80 font-medium text-sm tracking-widest uppercase mt-3 drop-shadow-md">Warehouse Intelligence</span>
        </div>
      </div>

      <!-- Bottom Copyright & Info -->
      <div class="relative z-10 p-8 mb-4 max-w-md">
        <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white/90">
          <p class="text-xs leading-relaxed">
            © 2026 Yield Guard | All rights reserved.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side: Auth Form Container -->
    <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white lg:rounded-tl-[3rem] shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)] z-10">
      
      <!-- Mobile Back Button -->
      <div class="w-full max-w-[420px] flex justify-start mb-6 lg:hidden mt-4">
        <button @click="navigateBack" class="flex items-center text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <ArrowLeft class="w-4 h-4 mr-2" />
          <span class="text-sm font-semibold">{{ t('auth.backShort') }}</span>
        </button>
      </div>

      <div class="w-full max-w-[420px]">
        <!-- Logo (Mobile Only - Desktop shows it on the left pane) -->
        <div class="flex lg:hidden items-center space-x-3 mb-10 justify-center cursor-pointer hover:opacity-80 transition-opacity" @click="navigateBack">
          <img src="../assets/logo.png" alt="Yield Guard Logo" class="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm p-0.5 bg-white" />
          <span class="text-2xl font-extrabold tracking-tight text-gray-900">Yield Guard</span>
        </div>

        <!-- Titles -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ authMode === 'login' ? t('auth.loginTitle') : authMode === 'signup' ? t('auth.signupTitle') : t('auth.resetTitle') }}
          </h1>
          <p class="text-sm text-gray-500 font-medium">
            {{ authMode === 'login' ? t('auth.loginSub') : authMode === 'signup' ? t('auth.signupSub') : t('auth.resetSub') }}
          </p>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm font-medium flex items-center">
          <CheckCircle2 class="w-4 h-4 mr-2" />
          {{ successMessage }}
        </div>

        <!-- Forms -->
        <form @submit.prevent="handleAuth" class="space-y-5">
          
          <!-- Name (Sign Up Only) -->
          <div v-if="authMode === 'signup'">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">{{ t('auth.fullName') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="name" type="text" required placeholder="Alexander Michael" class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm" />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">{{ t('auth.email') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="email" type="email" required placeholder="you@company.com" class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm" />
            </div>
          </div>

          <!-- Password (Login & Sign Up) -->
          <div v-if="authMode !== 'forgot'">
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-semibold text-gray-700">{{ t('auth.password') }}</label>
              <button v-if="authMode === 'login'" type="button" @click="toggleMode('forgot')" class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                {{ t('auth.forgot') }}
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="password" type="password" required placeholder="••••••••" class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm" />
            </div>
          </div>

          <!-- Primary Button -->
          <button type="submit" :disabled="isLoading" class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>
              {{ authMode === 'login' ? t('auth.btnLogin') : authMode === 'signup' ? t('auth.btnSignup') : t('auth.btnReset') }}
            </span>
          </button>
        </form>

        <!-- Toggle Auth Mode Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 font-medium">
            <span v-if="authMode === 'login'">
              {{ t('auth.noAccount') }} 
              <button @click="toggleMode('signup')" class="font-bold text-blue-600 hover:text-blue-800">{{ t('auth.btnSignup') }}</button>
            </span>
            <span v-else>
              {{ t('auth.hasAccount') }} 
              <button @click="toggleMode('login')" class="font-bold text-blue-600 hover:text-blue-800">{{ t('auth.btnLogin') }}</button>
            </span>
          </p>
        </div>

        <!-- Divider -->
        <div v-if="authMode !== 'forgot'" class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 bg-white text-gray-500 font-medium">{{ t('auth.orContinue') }}</span>
            </div>
          </div>

          <!-- Social Buttons -->
          <div class="mt-8 grid grid-cols-1 gap-3">
            <button type="button" class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {{ t('auth.google') }}
            </button>
            <button type="button" class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.365 7.143c-.488-1.583-1.465-2.73-2.83-3.328-1.365-.597-2.734-.6-4.103 0-1.369.598-2.346 1.745-2.83 3.328-.483 1.584-.366 3.082.35 4.498.718 1.415 1.764 2.457 3.134 3.125 1.369.667 2.76.713 4.174.137 1.415-.576 2.458-1.63 3.13-3.159.671-1.53.567-3.064-.315-4.601h-2.18l-1.077 1.944c.484.862.533 1.696.147 2.502-.387.805-1.01 1.353-1.87 1.642-1.014.341-1.895.275-2.646-.197-.75-.473-1.282-1.233-1.597-2.28-.315-1.047-.282-1.92.102-2.62.384-.7.973-1.163 1.768-1.391 1.014-.29 1.905-.205 2.673.256.768.46 1.328 1.258 1.68 2.392l2.259-.838zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" v-if="false" />
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.805 3.054 1.52-.07 2.104-.987 3.96-.987 1.841 0 2.368.987 3.974.956 1.666-.032 2.664-1.503 3.655-2.96 1.15-1.68 1.623-3.313 1.645-3.402-.038-.016-3.187-1.22-3.21-4.857-.02-3.048 2.493-4.52 2.612-4.595-1.433-2.093-3.646-2.378-4.437-2.433-2.025-.236-4.004 1.16-5.002 1.16zm1.378-2.61c.828-1.002 1.385-2.394 1.233-3.786-1.186.047-2.634.788-3.486 1.787-.762.883-1.42 2.316-1.242 3.676 1.33.103 2.668-.675 3.495-1.677z"/>
              </svg>
              {{ t('auth.apple') }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
