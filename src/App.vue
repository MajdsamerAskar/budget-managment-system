<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchUser();
});
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="app-sidebar">
      <AppSidebar />
    </aside>

    <!-- Main content -->
    <main class="app-main">
      <router-view />
    </main>
  </div>

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
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.app-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.app-sidebar {
  width: 256px;
  min-width: 256px;
  max-width: 256px;
  flex-shrink: 0;
  background-color: var(--surface-900);
  height: 100vh;
  overflow-y: auto;
}

.app-main {
  flex: 1;
  overflow: auto;
  background-color: var(--surface-50);
  height: 100vh;
}
</style>