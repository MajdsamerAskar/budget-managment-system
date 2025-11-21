<script setup>
import Button from 'primevue/button';

const emit = defineEmits(['create-budget']);

const handleCreateBudget = () => {
  emit('create-budget');
};
</script>

<template>
  <div class="quick-actions">
    <h4>Quick Actions</h4>
    <Button label="Create Budget" icon="pi pi-plus" class="w-full" @click="handleCreateBudget" />
    <Button label="Budget Reports" icon="pi pi-chart-line" class="w-full" outlined />
    <Button label="Export Data" icon="pi pi-download" class="w-full" outlined />
    <Button label="Manage Categories" icon="pi pi-tags" class="w-full" outlined />
  </div>
</template>

<style scoped>
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.quick-actions h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #6c757d;
}
</style>
