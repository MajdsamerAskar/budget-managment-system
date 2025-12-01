<script setup>
import { onMounted, ref } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import { useCategoryStore } from '@/stores/categoryStore';

// Components
import StatsCard from '@/components/dashboard/StatsCard.vue';
import BudgetProgress from '@/components/dashboard/BudgetProgress.vue';
import BudgetAlerts from '@/components/budgets/BudgetAlerts.vue';
import BudgetQuickActions from '@/components/budgets/BudgetQuickActions.vue';
import BudgetTable from '@/components/budgets/BudgetTable.vue';
import BudgetDialog from '@/components/budgets/BudgetDialog.vue';
import Button from 'primevue/button';
// ✅ REMOVED: ConfirmDialog - using global instance from App.vue

const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const showDialog = ref(false);
const budgetToEdit = ref(null);

onMounted(() => {
  budgetStore.fetchBudgets();
  categoryStore.fetchCategories();
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const openAddDialog = () => {
  budgetToEdit.value = null;
  showDialog.value = true;
};

const handleEditBudget = (budget) => {
  budgetToEdit.value = budget;
  showDialog.value = true;
};

const handleBudgetSaved = () => {
  showDialog.value = false;
  budgetToEdit.value = null;
  budgetStore.fetchBudgets();
};
</script>

<template>
  <div class="budgets-container">
    
    <!-- ✅ REMOVED: ConfirmDialog - using global instance from App.vue -->
    
    <!-- 1. HEADER SECTION -->
    <div class="header-section">
      <div>
        <h1>Budget Management</h1>
        <p class="text-secondary">Track and manage your budgets across all categories.</p>
      </div>
      <Button label="Create Budget" icon="pi pi-plus" @click="openAddDialog" />
    </div>

    <!-- 2. STATS CARDS ROW -->
    <div class="stats-grid">
      <StatsCard 
        title="Total Allocated" 
        :amount="formatCurrency(budgetStore.totalAllocated)" 
        icon="pi pi-wallet" 
        color="text-blue-500" 
        bg="bg-blue-100" 
      />
      <StatsCard 
        title="Total Spent" 
        :amount="formatCurrency(budgetStore.totalSpent)" 
        icon="pi pi-arrow-down" 
        color="text-red-500" 
        bg="bg-red-100" 
      />
      <StatsCard 
        title="Remaining" 
        :amount="formatCurrency(budgetStore.totalRemaining)" 
        icon="pi pi-check-circle" 
        color="text-green-500" 
        bg="bg-green-100" 
      />
      <StatsCard 
        title="Active Budgets" 
        :amount="budgetStore.activeBudgets.length.toString()" 
        icon="pi pi-chart-pie" 
        color="text-purple-500" 
        bg="bg-purple-100" 
      />
    </div>

    <!-- 3. MIDDLE SECTION: Budget Progress & Alerts -->
    <div class="middle-grid">
      <div class="card-panel">
        <BudgetProgress />
      </div>
      <div class="card-panel">
        <BudgetAlerts />
        <BudgetQuickActions @create-budget="openAddDialog" />
      </div>
    </div>

    <!-- 4. BOTTOM SECTION: All Budgets Table -->
    <div class="card-panel">
      <BudgetTable @edit-budget="handleEditBudget" />
    </div>

    <!-- Budget Dialog -->
    <BudgetDialog 
      v-model:visible="showDialog" 
      :budgetToEdit="budgetToEdit"
      @saved="handleBudgetSaved"
    />

  </div>
</template>

<style scoped>
.budgets-container {
  padding: 2rem;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.text-secondary { 
  margin-top: 0.5rem;
}

/* GRIDS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.middle-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card-panel {
  border-radius: 12px;
  padding: 1.5rem;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .middle-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>