<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import AppLayout from '@/components/layout/AppLayout.vue';

const authStore = useAuthStore();
const route = useRoute();

// Initialize theme
const { isDark } = useTheme();

const isPublicRoute = computed(() => {
  const publicRoutes = ['/login', '/register'];
  return publicRoutes.includes(route.path);
});

onMounted(async () => {
  await authStore.fetchUser();
});
</script>

<template>
  <AppLayout v-if="!isPublicRoute" />
  <router-view v-else />

  <!-- Global overlays -->
  <Toast />
  <ConfirmDialog />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>