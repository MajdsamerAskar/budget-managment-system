<template>
  <div class="accounts-header">
    <h1>Accounts</h1>
    

    <Button 
      label="Add Account" 
      icon="pi pi-plus" 
      @click="$emit('addAccount')"
      severity="success"
      class="addAccount"
    />
  </div>
  <p class="text-secondary">Manage all your financial accounts in one place.</p>
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
  margin-bottom: 0;
}
.addAccount {
  background-color: #10b981;
}
.accounts-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--surface-900);
  margin: 0;
}
.text-secondary {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .accounts-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>