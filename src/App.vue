<template>
  <router-view />
  <Toast />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

const authStore = useAuthStore();

onMounted(async () => {
  // Check if user is already logged in
  await authStore.fetchUser();
});
</script>

<style>
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