import { ref } from 'vue'

const isGlobalLoading = ref(false)
const loadingMessage = ref('Initializing Secure Session...')

export function useGlobalLoading() {
  const showLoading = (message = 'Initializing Secure Session...') => {
    loadingMessage.value = message
    isGlobalLoading.value = true
  }

  const hideLoading = () => {
    isGlobalLoading.value = false
  }

  return {
    isGlobalLoading,
    loadingMessage,
    showLoading,
    hideLoading
  }
}
