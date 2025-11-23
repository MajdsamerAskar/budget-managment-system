<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from './AppSidebar.vue';
import MobileHeader from './MobileHeader.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="app-layout">
    <!-- Mobile Header -->
    <MobileHeader @toggle-sidebar="toggleSidebar" />

    <!-- Overlay -->
    <div 
      class="sidebar-overlay" 
      :class="{ active: isSidebarOpen }"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside class="app-sidebar" :class="{ active: isSidebarOpen }">
      <AppSidebar @close="closeSidebar" />
    </aside>

    <!-- Main Content -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Desktop styles */
@media (min-width: 769px) {
  .sidebar-overlay {
    display: none;
  }

  .app-sidebar {
    width: 256px;
    min-width: 256px;
    flex-shrink: 0;
    background-color: white;
    height: 100vh;
    overflow-y: auto;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  }

  .app-main {
    flex: 1;
    overflow: auto;
    background-color: var(--surface-50);
    height: 100vh;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .sidebar-overlay.active {
    opacity: 1;
    pointer-events: all;
  }

  .app-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background-color: white;
    z-index: 1001;
    overflow-y: auto;
    transition: left 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  }

  .app-sidebar.active {
    left: 0;
  }

  .app-main {
    flex: 1;
    overflow: auto;
    background-color: var(--surface-50);
    height: calc(100vh - 60px);
    width: 100%;
  }
}
</style>