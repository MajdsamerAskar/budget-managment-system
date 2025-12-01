<script setup lang="ts">
defineEmits<{
  toggleSidebar: []
}>();
</script>

<template>
  <header class="mobile-header">
    <button class="hamburger-menu" @click="$emit('toggleSidebar')" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <h1>BMS</h1>
    <div style="width: 33px;"></div>
  </header>
</template>

<style scoped>
.mobile-header {
  display: none;
}

@media (max-width: 768px) {
  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: #333;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 60px;
  }

  .mobile-header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .hamburger-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    padding: 8px;
    background: transparent;
    border: none;
  }

  .hamburger-menu span {
    width: 25px;
    height: 3px;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
}
</style>