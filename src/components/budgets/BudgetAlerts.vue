<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';

const budgetStore = useBudgetStore();

const hasOverBudget = computed(() => budgetStore.overBudgetItems.length > 0);
const hasExpired = computed(() => budgetStore.expiredBudgets.length > 0);
const hasWarnings = computed(() => hasOverBudget.value || hasExpired.value);

const alerts = computed(() => {
  const alertList = [];

  if (hasOverBudget.value) {
    alertList.push({
      id: 'over-budget',
      type: 'danger',
      icon: 'pi pi-exclamation-triangle',
      title: 'Over Budget!',
      message: `${budgetStore.overBudgetItems.length} budget(s) exceeded`,
      count: budgetStore.overBudgetItems.length
    });
  }

  if (hasExpired.value) {
    alertList.push({
      id: 'expired',
      type: 'warning',
      icon: 'pi pi-info-circle',
      title: 'Expired Budgets',
      message: `${budgetStore.expiredBudgets.length} budget(s) have expired`,
      count: budgetStore.expiredBudgets.length
    });
  }

  if (!hasWarnings.value) {
    alertList.push({
      id: 'success',
      type: 'success',
      icon: 'pi pi-check-circle',
      title: 'All Good!',
      message: 'All budgets are on track'
    });
  }

  return alertList;
});
</script>

<template>
  <div class="budget-alerts">
    <h3>Budget Alerts</h3>
    
    <div 
      v-for="alert in alerts" 
      :key="alert.id" 
      class="alert-section"
    >
      <div 
        class="alert" 
        :class="`alert-${alert.type}`"
        role="alert"
        :aria-live="alert.type === 'danger' ? 'assertive' : 'polite'"
      >
        <i :class="alert.icon" :aria-hidden="true"></i>
        <div class="alert-content">
          <strong>{{ alert.title }}</strong>
          <p>{{ alert.message }}</p>
        </div>
      </div>
    </div>

    <div v-if="alerts.length === 0" class="empty-state">
      <i class="pi pi-inbox"></i>
      <p>No budget data available</p>
    </div>
  </div>
</template>

<style scoped>
.budget-alerts h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.alert-section {
  margin-bottom: 1rem;
}

.alert-section:last-child {
  margin-bottom: 0;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.alert:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.alert i {
  font-size: 1.25rem;
  flex-shrink: 0; 
}

.alert-content {
  flex: 1; 
  min-width: 0; 
}

.alert strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9375rem;
}

.alert p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9; 
}


.alert-danger {
  background: var(--red-50, #fee2e2);
  color: var(--red-900, #991b1b);
  border-left: 4px solid var(--red-500, #ef4444);
}

.alert-warning {
  background: var(--yellow-50, #fef3c7);
  color: var(--yellow-900, #92400e);
  border-left: 4px solid var(--yellow-500, #f59e0b);
}

.alert-success {
  background: var(--green-50, #d1fae5);
  color: var(--green-900, #065f46);
  border-left: 4px solid var(--green-500, #10b981);
}


.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-color-secondary);
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}


@media (max-width: 640px) {
  .alert {
    padding: 0.875rem;
    gap: 0.75rem;
  }

  .alert i {
    font-size: 1.125rem;
  }

  .alert strong {
    font-size: 0.875rem;
  }

  .alert p {
    font-size: 0.8125rem;
  }
}
</style>