<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Globe } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'

const props = defineProps({
  variant: {
    type: String,
    default: 'light' // 'light' or 'dark'
  }
})

const { currentLanguage, languages, setLanguage } = useLanguage()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (langCode) => {
  setLanguage(langCode)
  isOpen.value = false
}

// Close when clicking outside
const closeDropdown = () => {
  isOpen.value = false
}

let listener = null
onMounted(() => {
  listener = (e) => {
    if (!e.target.closest('.language-dropdown-container')) {
      closeDropdown()
    }
  }
  document.addEventListener('click', listener)
})

onUnmounted(() => {
  if (listener) {
    document.removeEventListener('click', listener)
  }
})
</script>

<template>
  <div class="relative language-dropdown-container">
    <button 
      @click="toggleDropdown"
      class="flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors border font-semibold text-sm"
      :class="variant === 'dark' 
        ? 'bg-black/20 hover:bg-black/40 border-white/10 text-white/90 hover:text-white backdrop-blur-md' 
        : 'bg-base-secondary hover:bg-base-primary border-border-soft text-content-secondary hover:text-content-primary'"
    >
      <Globe class="w-4 h-4" />
      <span class="uppercase tracking-wider">{{ currentLanguage }}</span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-base-secondary border border-border-soft z-50 overflow-hidden"
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between group"
            :class="currentLanguage === lang.code ? 'bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]' : 'text-content-secondary hover:bg-base-primary hover:text-content-primary'"
            role="menuitem"
          >
            <span>{{ lang.name }}</span>
            <span class="text-xs font-bold" :class="currentLanguage === lang.code ? 'text-[var(--color-accent-blue)]' : 'text-content-secondary/50'">{{ lang.short }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
