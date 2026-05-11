<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full max-w-[320px] rounded-xl overflow-hidden shadow-xl text-center">
        <div class="p-8 border-b border-gray-100">
          <p class="text-gray-700 text-lg">{{ t('logout.confirm') }}</p>
        </div>
        
        <div class="flex">
          <button 
            @click="emit('close')"
            class="flex-1 px-4 py-4 text-gray-900 font-bold hover:bg-gray-50 transition-colors border-r border-gray-100"
          >
            {{ t('logout.cancel') }}
          </button>
          <button 
            @click="emit('confirm')"
            class="flex-1 px-4 py-4 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
          >
            {{ t('logout.signout') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
