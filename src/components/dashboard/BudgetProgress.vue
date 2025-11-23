<script setup>
import { useBudgetStore } from '@/stores/budgetStore';
import ProgressBar from 'primevue/progressbar';

const budgetStore = useBudgetStore();
</script>

<template>
  <div>
    <h3>Budget Progress</h3>
    <div class="budget-list">
      <div v-for="budget in budgetStore.activeBudgets" :key="budget.id" class="budget-item">
        <div class="budget-info">
          <span class="category-name">{{ budget.name || 'name' }}</span>
          <span class="values">
            ${{ budget.spent }} / ${{ budget.total_amount }} 
            ({{ budgetStore.getPercentage(budget.spent, budget.total_amount) }}%)
          </span>
        </div>
        <!-- PrimeVue ProgressBar -->
        <ProgressBar 
          :value="budgetStore.getPercentage(budget.spent, budget.total_amount)" 
          :showValue="false" 
          style="height: 10px; border-radius: 5px;"
          :class="{'danger-bar': budgetStore.getBudgetStatus(budget) === 'danger'}"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.budget-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500;}
/* Customizing PrimeVue Bar Color based on status */
:deep(.p-progressbar-value) { background: #10b981; }
:deep(.danger-bar .p-progressbar-value) { background: #ef4444; }
</style>