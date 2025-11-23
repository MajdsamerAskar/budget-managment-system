<template>
  <div class="categories-page">
    <h1>Categories</h1>
    <p class="text-secondary">Organize and manage your spending categories.</p>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <StatsCard
        title="Total Income"
        :amount="formatCurrency(totalIncome)"
        icon="pi pi-arrow-up"
        color="text-green-500"
        bg="bg-green-100"
      />
      <StatsCard
        title="Total Expenses"
        :amount="formatCurrency(totalExpenses)"
        icon="pi pi-arrow-down"
        color="text-red-500"
        bg="bg-red-100"
      />
    </div>

    <!-- Add Button -->
    <Button 
      label="Add Category" 
      icon="pi pi-plus" 
      @click="categoryDialog?.open()" 
      class="mb-3 addCategory"
    />

    <!-- Categories Table -->
    <DataTable 
      :value="categoriesWithTotals" 
      :loading="categoryStore.isLoading"
      responsiveLayout="scroll"
    >
      <Column field="name" header="Category" />
      <Column field="type" header="Type">
        <template #body="{ data }">
          <Tag :value="data.type" :severity="data.type === 'Income' ? 'success' : 'danger'" />
        </template>
      </Column>
      <Column field="description" header="Description" />
      <Column header="Total">
        <template #body="{ data }">
          {{ formatCurrency(data.total) }}
        </template>
      </Column>
      <Column header="Color">
        <template #body="{ data }">
          <div 
            v-if="data.color" 
            class="color-preview" 
            :style="{ backgroundColor: data.color }"
          />
        </template>
      </Column>
      <Column header="Actions" style="width: 120px">
        <template #body="{ data }">
          <Button 
            icon="pi pi-pencil" 
            text 
            rounded 
            @click="categoryDialog?.open(data)" 
          />
          <Button 
            icon="pi pi-trash" 
            text 
            rounded 
            severity="danger" 
            @click="confirmDelete(data)" 
          />
        </template>
      </Column>
    </DataTable>

    <!-- Charts Section -->
    <div class="charts" v-if="categoriesWithTotals.length > 0">
      <div class="chart-container" v-if="totalExpenses > 0 || totalIncome > 0">
        <h3>Income vs Expense</h3>
        <Chart type="pie" :data="incomeVsExpenseData" :options="chartOptions" />
      </div>
      <div class="chart-container" v-if="categoriesWithTotals.some(c => c.type === 'Expense' && c.total > 0)">
        <h3>Expense Breakdown</h3>
        <Chart type="pie" :data="expenseChartData" :options="chartOptions" />
      </div>
      <div class="chart-container" v-if="categoriesWithTotals.some(c => c.type === 'Income' && c.total > 0)">
        <h3>Income Breakdown</h3>
        <Chart type="pie" :data="incomeChartData" :options="chartOptions" />
      </div>
    </div>
    <div v-else class="no-data">
      <p>No categories yet. Add some categories and transactions to see charts.</p>
    </div>

    <!-- Category Form Dialog -->
    <CategoryFormDialog
      ref="categoryDialog"
      @saved="handleSave"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import CategoryFormDialog from '@/components/categories/AddCategoryForm.vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/types';

const categoryStore = useCategoryStore();
const transactionStore = useTransactionStore();
const confirm = useConfirm();
const toast = useToast();
const categoryDialog = ref<InstanceType<typeof CategoryFormDialog>>();

// Fetch on mount
onMounted(() => {
  categoryStore.fetchCategories();
  transactionStore.fetchTransactions();
});

// Compute totals per category from transactions
const categoryTotals = computed(() => {
  const totals: Record<string, number> = {};
  transactionStore.transactions.forEach(t => {
    totals[t.category_id] = (totals[t.category_id] || 0) + t.amount;
  });
  return totals;
});

// Categories with computed totals
const categoriesWithTotals = computed(() => 
  categoryStore.categories.map(c => ({
    ...c,
    total: categoryTotals.value[c.id] || 0
  }))
);

// Computed totals for stats cards
const totalExpenses = computed(() =>
  categoriesWithTotals.value
    .filter(c => c.type === 'Expense')
    .reduce((sum, c) => sum + c.total, 0)
);

const totalIncome = computed(() =>
  categoriesWithTotals.value
    .filter(c => c.type === 'Income')
    .reduce((sum, c) => sum + c.total, 0)
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// Save handler (add or edit)
const handleSave = async () => {
  const dialog = categoryDialog.value;
  if (!dialog) return;

  dialog.setLoading(true);

  try {
    if (dialog.isEditMode && dialog.editingId) {
      await categoryStore.updateCategory(dialog.editingId, dialog.form);
      toast.add({ severity: 'success', summary: 'Updated', detail: 'Category updated successfully', life: 3000 });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await categoryStore.addCategory({
        ...dialog.form,
        user_id: user?.id
      });
      toast.add({ severity: 'success', summary: 'Created', detail: 'Category created successfully', life: 3000 });
    }
    dialog.close();
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: categoryStore.error, life: 3000 });
  } finally {
    dialog.setLoading(false);
  }
};

// Delete handler
const confirmDelete = (category: Category) => {
  confirm.require({
    message: `Are you sure you want to delete "${category.name}"?`,
    header: 'Delete Category',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await categoryStore.deleteCategory(category.id);
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Category deleted', life: 3000 });
      } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: categoryStore.error, life: 3000 });
      }
    }
  });
};

// Chart data - using categoriesWithTotals
const incomeVsExpenseData = computed(() => ({
  labels: ['Expenses', 'Income'],
  datasets: [{
    data: [totalExpenses.value, totalIncome.value],
    backgroundColor: ['#f87171', '#34d399']
  }]
}));

const expenseChartData = computed(() => {
  const expenses = categoriesWithTotals.value.filter(c => c.type === 'Expense');
  return {
    labels: expenses.map(c => c.name),
    datasets: [{
      data: expenses.map(c => c.total),
      backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#a78bfa', '#f472b6']
    }]
  };
});

const incomeChartData = computed(() => {
  const income = categoriesWithTotals.value.filter(c => c.type === 'Income');
  return {
    labels: income.map(c => c.name),
    datasets: [{
      data: income.map(c => c.total),
      backgroundColor: ['#34d399', '#10b981', '#22d3ee', '#fde68a']
    }]
  };
});

const chartOptions = {
  plugins: {
    legend: { labels: { color: '#000' } }
  }
};
</script>

<style scoped>
.categories-page {
  padding: 2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}
.chart-container {
  flex: 1 1 300px;
  max-width: 400px;
}
.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.addCategory {
  margin-bottom: 20px;
}
.text-secondary {
  margin-bottom: 2rem;
}
</style>