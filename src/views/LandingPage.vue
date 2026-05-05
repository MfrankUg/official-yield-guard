<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, ShieldCheck, Thermometer, Droplet, Bell, ChevronRight, CheckCircle2, Coffee, Star, Bot, AlertTriangle, ChevronUp } from 'lucide-vue-next'
import PixelDisintegrateImage from '../components/PixelDisintegrateImage.vue'
import LanguageDropdown from '../components/LanguageDropdown.vue'
import { useLanguage } from '../composables/useLanguage'
import logoImg from '../assets/logo.png'

const router = useRouter()
const { t } = useLanguage()

const navigateToDashboard = () => {
  router.push('/dashboard')
}

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToSignup = () => {
  router.push('/signup')
}

import jonardImg from '../assets/MBALIBULA JONARD.png'
import arwaiImg from '../assets/ARWAI JUSTIN.png'
import kiizaImg from '../assets/KIIZA DAVID.png'
import nelsonImg from '../assets/Kusiima Nelson.png'
import graciousImg from '../assets/Tenywa Gracious.png'

const founders = [
  { name: 'Mbalibula Jonard', role: 'Co-Founder & CEO', image: jonardImg },
  { name: 'Arwai Justin', role: 'Co-Founder & CTO', image: arwaiImg },
  { name: 'Kiiza David', role: 'Co-Founder & Lead Engineer', image: kiizaImg },
  { name: 'Kusiima Nelson', role: 'Co-Founder & AI Specialist', image: nelsonImg },
  { name: 'Tenywa Gracious', role: 'Co-Founder & Product Lead', image: graciousImg }
]

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let observer = null

onMounted(() => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll')
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target) // Only reveal once
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })
  
  revealElements.forEach(el => observer.observe(el))
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden w-full">
    
    <!-- Navbar -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-2 cursor-pointer" @click="scrollToTop">
          <img src="../assets/logo.png" alt="Yield Guard Logo" class="w-8 h-8 rounded-md shadow-sm" />
          <span class="text-xl font-bold tracking-tight text-gray-900">Yield Guard</span>
        </div>
        
        <div class="hidden md:flex space-x-8">
          <a href="#features" class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">{{ t('landing.features') }}</a>
          <a href="#founders" class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">{{ t('landing.founders') }}</a>
          <a href="#pricing" class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">{{ t('landing.pricing') }}</a>
        </div>

        <div class="flex items-center space-x-4">
          <LanguageDropdown variant="light" class="hidden sm:block" />
          <button @click="navigateToLogin" class="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">{{ t('auth.btnLogin') }}</button>
          <button @click="navigateToSignup" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5">
            {{ t('auth.btnSignup') }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section Wrapper -->
    <div class="relative w-full bg-white overflow-hidden">
      <!-- Mesh Grid Background -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]"></div>
      
      <!-- Subtle top glowing blob -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] max-w-4xl overflow-hidden pointer-events-none z-0">
        <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/80 rounded-[100%] blur-3xl"></div>
      </div>

      <section class="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        <div class="w-full lg:w-1/2 pr-0 lg:pr-12 text-center lg:text-left mb-16 lg:mb-0 animate-fade-in-up">

        <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-8 border border-blue-100">
          <Sparkles class="w-4 h-4" />
          <span class="text-sm font-bold tracking-wider">{{ t('landing.heroTag') }}</span>
        </div>
        <h1 class="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
          {{ t('landing.heroTitle') }}
        </h1>
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          {{ t('landing.heroSub') }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <button @click="navigateToSignup" class="w-full sm:w-auto bg-[var(--color-accent-blue)] hover:bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-lg shadow-[var(--color-accent-blue)]/30">
            {{ t('landing.getStarted') }}
          </button>
          <button @click="navigateToDashboard" class="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-700 px-8 py-3.5 rounded-full text-base font-semibold transition-all flex items-center justify-center">
            {{ t('landing.howItWorks') }} <ChevronRight class="w-4 h-4 ml-2" />
          </button>
        </div>
        
        <div class="mt-12 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 reveal-on-scroll delay-200">
          <div>
            <h4 class="text-2xl font-bold text-gray-900">47.5K+</h4>
            <p class="text-sm text-gray-500 font-medium">{{ t('landing.statsBeans') }}</p>
          </div>
          <div>
            <h4 class="text-2xl font-bold text-gray-900">1,204</h4>
            <p class="text-sm text-gray-500 font-medium">{{ t('landing.statsSensors') }}</p>
          </div>
          <div>
            <h4 class="text-2xl font-bold text-gray-900">99.9%</h4>
            <p class="text-sm text-gray-500 font-medium">{{ t('landing.statsUptime') }}</p>
          </div>
        </div>
      </div>
      
      <div class="w-full lg:w-1/2 relative flex justify-center items-center animate-slide-in-right">
        <!-- Floating decorative backgrounds -->
        <div class="absolute w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style="animation-duration: 4s;"></div>
        <div class="absolute w-64 h-64 bg-orange-400/10 rounded-full blur-3xl translate-x-20 -translate-y-10"></div>
        
        <!-- Main Logo Presentation (Interactive Canvas) -->
        <div class="relative z-10 w-full max-w-sm sm:max-w-md h-[400px] sm:h-[450px]">
          <PixelDisintegrateImage :src="logoImg" :resolution="4" :interactionRadius="80" />
        </div>
      </div>
    </section>
    </div>

    <!-- Trusted By -->
    <section class="bg-gray-50 py-10 border-y border-gray-100 overflow-hidden">
      <div class="w-full text-center">
        <p class="text-sm font-semibold text-gray-500 mb-8 uppercase tracking-wider">Trusted by Premium Coffee Exporters</p>
        
        <!-- Marquee Container -->
        <div class="relative flex overflow-x-hidden bg-gray-50">
          <div class="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] opacity-50 grayscale transition-all duration-300 w-max">
            <!-- First Set -->
            <div class="flex items-center space-x-2 px-12"><Coffee class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">BeanCorp</span></div>
            <div class="flex items-center space-x-2 px-12"><ShieldCheck class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">AgriSafe</span></div>
            <div class="flex items-center space-x-2 px-12"><Thermometer class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">ClimaTech</span></div>
            <div class="flex items-center space-x-2 px-12"><Sparkles class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">YieldPro</span></div>
            <div class="flex items-center space-x-2 px-12"><Coffee class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">HarvestGuard</span></div>

            <!-- Duplicated Set for Seamless Loop -->
            <div class="flex items-center space-x-2 px-12"><Coffee class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">BeanCorp</span></div>
            <div class="flex items-center space-x-2 px-12"><ShieldCheck class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">AgriSafe</span></div>
            <div class="flex items-center space-x-2 px-12"><Thermometer class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">ClimaTech</span></div>
            <div class="flex items-center space-x-2 px-12"><Sparkles class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">YieldPro</span></div>
            <div class="flex items-center space-x-2 px-12"><Coffee class="w-6 h-6 text-gray-800 shrink-0"/><span class="font-bold text-xl text-gray-800">HarvestGuard</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center mb-20">
        <h2 class="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Our Product</h2>
        <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">Features That Ensure Quality</h3>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">We combine hardware sensors with predictive AI to completely eliminate the guesswork from coffee bean storage.</p>
      </div>

      <div class="space-y-32">
        <!-- Feature 1 -->
        <div class="flex flex-col md:flex-row items-center md:space-x-16 reveal-on-scroll">
          <div class="w-full md:w-1/2 mb-10 md:mb-0 bg-blue-50 rounded-3xl p-8 lg:p-12 flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-500">
             <img :src="logoImg" alt="Yield Guard Environment Monitor" class="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="w-full md:w-1/2">
            <h4 class="text-3xl font-bold text-gray-900 mb-4">Easily Monitor The Overall Environment</h4>
            <p class="text-gray-600 mb-8 text-lg">Never wonder about the condition of your warehouse. Get real-time updates directly from the floor.</p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-start"><CheckCircle2 class="w-6 h-6 text-blue-600 mr-3 shrink-0" /><span class="text-gray-700 font-medium">Track temperature & humidity instantly</span></li>
              <li class="flex items-start"><CheckCircle2 class="w-6 h-6 text-blue-600 mr-3 shrink-0" /><span class="text-gray-700 font-medium">View historical graphs to spot trends</span></li>
            </ul>
            <button @click="navigateToDashboard" class="text-blue-600 font-semibold hover:text-blue-700 flex items-center">Learn More <ChevronRight class="w-4 h-4 ml-1" /></button>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="flex flex-col md:flex-row-reverse items-center reveal-on-scroll delay-100">
          <div class="w-full md:w-1/2 mb-10 md:mb-0 bg-gray-50 rounded-3xl p-8 lg:p-12 md:ml-16">
             <div class="relative rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500 bg-white">
                <img src="../assets/ai_feature.png" alt="AI Actionable Insights" class="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
             </div>
          </div>
          <div class="w-full md:w-1/2">
            <h4 class="text-3xl font-bold text-gray-900 mb-4">Actionable AI Insights</h4>
            <p class="text-gray-600 mb-8 text-lg">Our system doesn't just show numbers; it tells you exactly what to do. AI analyzes the data to prevent crop loss before it happens.</p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-start"><CheckCircle2 class="w-6 h-6 text-blue-600 mr-3 shrink-0" /><span class="text-gray-700 font-medium">Receive specific actions to take</span></li>
              <li class="flex items-start"><CheckCircle2 class="w-6 h-6 text-blue-600 mr-3 shrink-0" /><span class="text-gray-700 font-medium">Voice-activated AI assistant</span></li>
            </ul>
            <button @click="navigateToDashboard" class="text-blue-600 font-semibold hover:text-blue-700 flex items-center">Learn More <ChevronRight class="w-4 h-4 ml-1" /></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Founders Section -->
    <section id="founders" class="bg-gray-50 py-20 md:py-32 border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Our Team</h2>
          <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">Meet The Founders</h3>
          <p class="mt-4 text-gray-600 max-w-2xl mx-auto">The brilliant minds behind Yield Guard, dedicated to revolutionizing agricultural storage.</p>
        </div>

        <div class="flex flex-wrap justify-center gap-8 reveal-on-scroll">
          <div v-for="founder in founders" :key="founder.name" class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow p-6 text-center w-64 border border-gray-100">
            <!-- Photo using RandomUser API -->
            <div class="w-28 h-28 mx-auto bg-gray-100 rounded-full mb-5 overflow-hidden border-4 border-blue-100 shadow-inner relative">
              <img :src="founder.image" :alt="founder.name" class="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
            <h4 class="text-lg font-bold text-gray-900">{{ founder.name }}</h4>
            <p class="text-sm font-medium text-blue-600 mt-1">{{ founder.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Our Pricing</h2>
        <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">Attractive Offers For Your Warehouse</h3>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">Choose a plan that scales with your storage needs.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
        <!-- Free -->
        <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col h-full reveal-on-scroll">
          <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-6">Starter Pack</span>
          <div class="mb-6"><span class="text-5xl font-extrabold text-gray-900">$199</span></div>
          <ul class="space-y-4 mb-8 flex-1">
            <li class="flex items-center text-gray-600"><CheckCircle2 class="w-5 h-5 text-gray-400 mr-2 shrink-0" /> 1 Sensor Node</li>
            <li class="flex items-center text-gray-600"><CheckCircle2 class="w-5 h-5 text-gray-400 mr-2 shrink-0" /> Basic Monitoring</li>
            <li class="flex items-center text-gray-600"><CheckCircle2 class="w-5 h-5 text-gray-400 mr-2 shrink-0" /> 24hr Data History</li>
          </ul>
          <button @click="navigateToSignup" class="w-full py-3 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-colors">Start Free</button>
        </div>

        <!-- Pro -->
        <div class="bg-blue-600 rounded-3xl border border-blue-600 p-8 shadow-2xl flex flex-col transform md:-translate-y-4 h-full relative z-10 reveal-on-scroll delay-100">
          <span class="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-6">Premium Package</span>
          <div class="mb-6"><span class="text-5xl font-extrabold text-white">$499</span></div>
          <ul class="space-y-4 mb-8 flex-1">
            <li class="flex items-center text-white"><CheckCircle2 class="w-5 h-5 text-white mr-2 shrink-0" /> 5 Sensor Nodes</li>
            <li class="flex items-center text-white"><CheckCircle2 class="w-5 h-5 text-white mr-2 shrink-0" /> AI Predictive Alerts</li>
            <li class="flex items-center text-white"><CheckCircle2 class="w-5 h-5 text-white mr-2 shrink-0" /> Unlimited History</li>
          </ul>
          <button @click="navigateToSignup" class="w-full py-3 rounded-full bg-white text-blue-600 font-bold hover:bg-gray-50 transition-colors shadow-md">Buy Now</button>
        </div>

        <!-- Enterprise -->
        <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col h-full reveal-on-scroll delay-200">
          <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-6">Business Package</span>
          <div class="mb-6"><span class="text-5xl font-extrabold text-gray-900">$899</span></div>
          <ul class="space-y-4 mb-8 flex-1">
            <li class="flex items-center text-gray-600"><CheckCircle2 class="w-5 h-5 text-gray-400 mr-2 shrink-0" /> Unlimited Sensors</li>
            <li class="flex items-center text-gray-600"><CheckCircle2 class="w-5 h-5 text-gray-400 mr-2 shrink-0" /> Custom AI Rules</li>
            <li class="flex items-center text-gray-600"><CheckCircle2 class="w-5 h-5 text-gray-400 mr-2 shrink-0" /> 24/7 Priority Support</li>
          </ul>
          <button @click="navigateToSignup" class="w-full py-3 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:border-blue-600 hover:text-blue-600 transition-colors">Buy Now</button>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
      <div class="text-center mb-16">
        <h2 class="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Testimonials</h2>
        <h3 class="text-3xl md:text-4xl font-extrabold text-gray-900">Various Positive Responses</h3>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">Hear from warehouse managers who have secured their yields.</p>
      </div>

      <div class="relative flex overflow-x-hidden w-full pb-12 pt-4 reveal-on-scroll">
        <!-- Transparent gradient masks for smooth edge fading -->
        <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <!-- Marquee Slider Container -->
        <div class="flex space-x-8 animate-marquee-slow hover:[animation-play-state:paused] w-max px-4 cursor-pointer">
          <!-- Two identical sets mapped for seamless looping -->
          <template v-for="set in [1, 2]" :key="set">
            <!-- Review 1 -->
            <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
               <div class="flex items-center space-x-4 mb-6">
                 <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Alexander Michael" class="w-14 h-14 rounded-full border-2 border-blue-50 object-cover" />
                 <div>
                   <h4 class="text-lg font-bold text-gray-900 leading-tight">Alexander Michael</h4>
                   <p class="text-sm text-[var(--color-accent-blue)] font-semibold mt-0.5">Warehouse Manager</p>
                 </div>
               </div>
               <div class="flex mb-5 space-x-1">
                 <Star v-for="i in 5" :key="`star1-${i}`" class="w-5 h-5 text-yellow-400 fill-current" />
               </div>
               <p class="text-gray-600 italic leading-relaxed text-lg">
                 "This platform has become my favorite. The AI insights make it so easy for me to protect all my coffee beans and prevent mold. Very good service!"
               </p>
            </div>
            
            <!-- Review 2 -->
            <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
               <div class="flex items-center space-x-4 mb-6">
                 <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Jenkins" class="w-14 h-14 rounded-full border-2 border-blue-50 object-cover" />
                 <div>
                   <h4 class="text-lg font-bold text-gray-900 leading-tight">Sarah Jenkins</h4>
                   <p class="text-sm text-[var(--color-accent-blue)] font-semibold mt-0.5">Quality Control Lead</p>
                 </div>
               </div>
               <div class="flex mb-5 space-x-1">
                 <Star v-for="i in 5" :key="`star2-${i}`" class="w-5 h-5 text-yellow-400 fill-current" />
               </div>
               <p class="text-gray-600 italic leading-relaxed text-lg">
                 "Yield Guard completely transformed our operations. We no longer rely on manual checks, and the predictive alerts are scarily accurate."
               </p>
            </div>

            <!-- Review 3 -->
            <div class="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 w-[400px] flex-shrink-0">
               <div class="flex items-center space-x-4 mb-6">
                 <img src="https://randomuser.me/api/portraits/men/88.jpg" alt="David Ochola" class="w-14 h-14 rounded-full border-2 border-blue-50 object-cover" />
                 <div>
                   <h4 class="text-lg font-bold text-gray-900 leading-tight">David Ochola</h4>
                   <p class="text-sm text-[var(--color-accent-blue)] font-semibold mt-0.5">Logistics Director</p>
                 </div>
               </div>
               <div class="flex mb-5 space-x-1">
                 <Star v-for="i in 5" :key="`star3-${i}`" class="w-5 h-5 text-yellow-400 fill-current" />
               </div>
               <p class="text-gray-600 italic leading-relaxed text-lg">
                 "The return on investment was visible in the first month. By maintaining strict environmental controls, our premium yield remained untouched."
               </p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bg-blue-600 py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div class="relative z-10 reveal-on-scroll">
        <h2 class="text-blue-200 font-semibold tracking-wide uppercase text-sm mb-4">Join Us Today</h2>
        <h3 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 max-w-3xl mx-auto leading-tight">
          Let's Use Our Services And Simplify Your Coffee Storage
        </h3>
        <button @click="navigateToSignup" class="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-colors shadow-xl">
          Start Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div class="text-sm text-gray-400 mb-4 md:mb-0">
          © 2026 Yield Guard. All rights reserved.
        </div>
        
        <button @click="scrollToTop" class="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-[var(--color-accent-blue)] transition-colors">
          <span>Scroll to Top</span>
          <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50">
            <ChevronUp class="w-4 h-4" />
          </div>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}

.animate-marquee-slow {
  animation: marquee 40s linear infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.animate-slide-in-right {
  animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.delay-100 { transition-delay: 100ms; animation-delay: 100ms; }
.delay-200 { transition-delay: 200ms; animation-delay: 200ms; }
.delay-300 { transition-delay: 300ms; animation-delay: 300ms; }
</style>
