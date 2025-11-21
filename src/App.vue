<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

// We do NOT define routes here. We just use the store.
const authStore = useAuthStore();

onMounted(async () => {
  // Check if user is already logged in
  await authStore.fetchUser();
});
</script>

<template>
  <!-- This renders the component matching the URL -->
  <router-view />
  
  <!-- Global Overlays -->
  <Toast />
  <ConfirmDialog />
</template>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>