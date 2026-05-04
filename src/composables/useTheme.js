import { ref } from 'vue'

const isDarkMode = ref(true)

export function useTheme() {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('yield_guard_theme')
    if (savedTheme === 'light') {
      isDarkMode.value = false
      document.documentElement.classList.add('light')
    } else {
      isDarkMode.value = true
      document.documentElement.classList.remove('light')
    }
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.remove('light')
      localStorage.setItem('yield_guard_theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      localStorage.setItem('yield_guard_theme', 'light')
    }
  }

  return {
    isDarkMode,
    initTheme,
    toggleTheme
  }
}
