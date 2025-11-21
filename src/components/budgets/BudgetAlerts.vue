<script setup>
import { useBudgetStore } from '@/stores/budgetStore';

const budgetStore = useBudgetStore();
</script>

<template>
  <div class="budget-alerts">
    <h3>Budget Alerts</h3>
    
    <div v-if="budgetStore.overBudgetItems.length > 0" class="alert-section">
      <div class="alert alert-danger">
        <i class="pi pi-exclamation-triangle"></i>
        <div>
          <strong>Over Budget!</strong>
          <p>{{ budgetStore.overBudgetItems.length }} budget(s) exceeded</p>
        </div>
      </div>
    </div>

    <div v-if="budgetStore.expiredBudgets.length > 0" class="alert-section">
      <div class="alert alert-warning">
        <i class="pi pi-info-circle"></i>
        <div>
          <strong>Expired Budgets</strong>
          <p>{{ budgetStore.expiredBudgets.length }} budget(s) have expired</p>
        </div>
      </div>
    </div>

    <div v-if="budgetStore.overBudgetItems.length === 0 && budgetStore.expiredBudgets.length === 0" class="alert-section">
      <div class="alert alert-success">
        <i class="pi pi-check-circle"></i>
        <div>
          <strong>All Good!</strong>
          <p>All budgets are on track</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-alerts h3 {
  margin: 0 0 1rem 0;
}

.alert-section {
  margin-bottom: 1rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.alert i {
  font-size: 1.25rem;
}

.alert strong {
  display: block;
  margin-bottom: 0.25rem;
}

.alert p {
  margin: 0;
  font-size: 0.875rem;
}

.alert-danger {
  background: #fee2e2;
  color: #991b1b;
  border-left: 4px solid #ef4444;
}

.alert-warning {
  background: #fef3c7;
  color: #92400e;
  border-left: 4px solid #f59e0b;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #10b981;
}
</style>