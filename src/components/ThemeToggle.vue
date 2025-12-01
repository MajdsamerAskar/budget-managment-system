<template>
  <Button
    @click="toggleTheme"
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    text
    rounded
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    v-tooltip.bottom="isDark ? 'Light Mode' : 'Dark Mode'"
  />
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import Button from 'primevue/button'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
/* No dark mode styles needed - all handled in style.css */
.theme-toggle {
  width: 2.5rem;
  height: 2.5rem;
}
</style>