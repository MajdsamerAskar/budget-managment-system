<script setup>
import { useBudgetStore } from '@/stores/budgetStore';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

// Components
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';

const budgetStore = useBudgetStore();
const confirm = useConfirm();
const toast = useToast();

// Emit event to tell parent to open the dialog with this budget
const emit = defineEmits(['edit-budget']);

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

// --- DELETE HANDLER ---
const confirmDelete = (budget) => {
  confirm.require({
    message: `Are you sure you want to delete the budget "${budget.name}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await budgetStore.deleteBudget(budget.id);
        toast.add({ 
          severity: 'success', 
          summary: 'Deleted', 
          detail: 'Budget has been removed', 
          life: 3000 
        });
      } catch (error) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.message || 'Failed to delete budget', 
          life: 3000 
        });
      }
    },
    reject: () => {
    }
  });
};

// --- EDIT HANDLER ---
const onEditClick = (budget) => {
  // Pass the budget object up to the parent view
  emit('edit-budget', budget);
};
</script>

<template>
  <div class="budget-table">
    <!-- REMOVED: ConfirmDialog component - it's now in parent -->

    <div class="section-header">
      <h3>All Budgets</h3>
      <div class="table-actions">
        <Button 
          label="Refresh" 
          icon="pi pi-refresh" 
          outlined 
          @click="budgetStore.fetchBudgets()" 
        />
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
      
      <!-- ACTIONS COLUMN -->
      <Column header="Actions" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="action-buttons-row">
            
            <!-- EDIT BUTTON -->
            <Button 
              icon="pi pi-pencil" 
              size="small" 
              text 
              rounded
              @click="onEditClick(data)" 
            />

            <!-- DELETE BUTTON -->
            <Button 
              icon="pi pi-trash" 
              size="small" 
              text 
              severity="danger" 
              rounded
              @click="confirmDelete(data)" 
            />

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