<template>
  <div class="accounts-header">
    <h1>Accounts</h1>
    <Button 
      label="Add Account" 
      icon="pi pi-plus" 
      @click="$emit('addAccount')"
      severity="success"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

defineEmits<{
  addAccount: []
}>();
</script>

<style scoped>
.accounts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.accounts-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--surface-900);
  margin: 0;
}

@media (max-width: 768px) {
  .accounts-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>