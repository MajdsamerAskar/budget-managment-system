<script setup>
import { useBudgetStore } from '@/stores/budgetStore';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';

const budgetStore = useBudgetStore();

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get severity for tags
const getSeverity = (status) => {
  const severityMap = {
    safe: 'success',
    warning: 'warning',
    danger: 'danger'
  };
  return severityMap[status];
};
</script>

<template>
  <div class="budget-table">
    <div class="section-header">
      <h3>All Budgets</h3>
      <div class="table-actions">
        <Button label="Filter" icon="pi pi-filter" size="small" outlined />
        <Button label="Export" icon="pi pi-download" size="small" outlined />
      </div>
    </div>

    <DataTable 
      :value="budgetStore.budgets" 
      :loading="budgetStore.isLoading"
      stripedRows 
      paginator 
      :rows="10"
      responsiveLayout="scroll"
      :emptyMessage="'No budgets found. Create your first budget to get started!'"
    >
      <Column field="name" header="Budget Name" sortable></Column>
      <Column field="total_amount" header="Allocated" sortable>
        <template #body="{ data }">
          {{ formatCurrency(data.total_amount) }}
        </template>
      </Column>
      <Column field="spent" header="Spent" sortable>
        <template #body="{ data }">
          {{ formatCurrency(data.spent) }}
        </template>
      </Column>
      <Column header="Remaining">
        <template #body="{ data }">
          {{ formatCurrency(data.total_amount - data.spent) }}
        </template>
      </Column>
      <Column header="Progress">
        <template #body="{ data }">
          <div class="progress-cell">
            <span>{{ budgetStore.getPercentage(data.spent, data.total_amount) }}%</span>
            <ProgressBar 
              :value="budgetStore.getPercentage(data.spent, data.total_amount)" 
              :showValue="false"
              style="height: 8px; width: 100px;"
              :class="{'progress-danger': data.spent > data.total_amount}"
            />
          </div>
        </template>
      </Column>
      <Column header="Status">
        <template #body="{ data }">
          <Tag 
            :value="budgetStore.getBudgetStatus(data)" 
            :severity="getSeverity(budgetStore.getBudgetStatus(data))"
          />
        </template>
      </Column>
      <Column field="start_date" header="Start Date" sortable></Column>
      <Column field="end_date" header="End Date" sortable></Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons-row">
            <Button icon="pi pi-pencil" size="small" text />
            <Button icon="pi pi-trash" size="small" text severity="danger" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-danger :deep(.p-progressbar-value) {
  background-color: #ef4444;
}

.action-buttons-row {
  display: flex;
  gap: 0.25rem;
}
</style>