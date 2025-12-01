// composables/useTheme.js
import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const updateTheme = () => {
    const element = document.documentElement
    
    if (isDark.value) {
      element.classList.add('app-dark')
      localStorage.setItem('theme', 'dark')
    } else {
      element.classList.remove('app-dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  }

  // Watch for changes and update theme
  watch(isDark, () => {
    updateTheme()
  })

  onMounted(() => {
    initTheme()
    updateTheme()
  })

  return {
    isDark,
    toggleTheme
  }
}