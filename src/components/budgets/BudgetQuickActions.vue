<script setup>
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budgetStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';

const router = useRouter();
const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const toast = useToast();

const emit = defineEmits(['create-budget']);

const handleCreateBudget = () => {
  emit('create-budget');
};

const handleManageCategories = () => {
  router.push('/categories');
};

const handleExportData = () => {
  try {
    // Get all budgets
    const budgets = budgetStore.budgets;

    if (!budgets || budgets.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No budgets available to export',
        life: 3000
      });
      return;
    }

    // Prepare CSV data
    const headers = ['Budget Name', 'Total Amount', 'Spent', 'Remaining', 'Category ID', 'Start Date', 'End Date', 'Status'];
    
    const csvRows = [
      headers.join(','), // Header row
      ...budgets.map(budget => {
        const remaining = budget.total_amount - budget.spent;
        const status = budgetStore.getBudgetStatus(budget);
        const category = categoryStore.categories.find(c => c.id === budget.category_id);
        const categoryName = category ? category.name : 'Unknown';
        
        return [
          `"${budget.name}"`,
          budget.total_amount,
          budget.spent,
          remaining,
          categoryName,
          budget.start_date,
          budget.end_date,
          status
        ].join(',');
      })
    ];

    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `budgets_export_${date}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);

    toast.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: `Downloaded ${filename}`,
      life: 3000
    });

  } catch (error) {
    console.error('Export error:', error);
    toast.add({
      severity: 'error',
      summary: 'Export Failed',
      detail: 'Failed to export budget data',
      life: 3000
    });
  }
};
</script>

<template>
  <div class="quick-actions">
    <h4>Quick Actions</h4>
    
    <Button 
      label="Create Budget" 
      icon="pi pi-plus" 
      class="w-full" 
      @click="handleCreateBudget" 
    />
    
    <Button 
      label="Export Data" 
      icon="pi pi-download" 
      class="w-full" 
      outlined 
      @click="handleExportData"
    />
    
    <Button 
      label="Manage Categories" 
      icon="pi pi-tags" 
      class="w-full" 
      outlined 
      @click="handleManageCategories"
    />
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