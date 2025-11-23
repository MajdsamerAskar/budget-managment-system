<script setup>
import { onMounted, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useBudgetStore } from '@/stores/budgetStore';
import { useAccountStore } from '@/stores/accountStore';

// Components
import StatsCard from '@/components/dashboard/StatsCard.vue';
import BudgetProgress from '@/components/dashboard/BudgetProgress.vue';
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue';
import SpendingChart from '@/components/dashboard/SpendingChart.vue';
import Button from 'primevue/button';

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();
const accountStore = useAccountStore();

// Format currency helper
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Reactive computed values
const totalBalance = computed(() => 
  accountStore.accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
);

onMounted(() => {
  transactionStore.fetchTransactions();
  budgetStore.fetchBudgets();
  accountStore.fetchAccounts();
});
</script>

<template>
  <div class="dashboard-container">
    
    <!-- 1. HEADER SECTION -->
    <div class="header-section">
      <div>
        <h1>Financial Dashboard</h1>
        <p class="text-secondary">Welcome back! Here's your financial overview.</p>
      </div>
    </div>

    <!-- 2. STATS CARDS ROW - NOW REACTIVE! -->
    <div class="stats-grid">
      <StatsCard 
        title="Total Balance" 
        :amount="formatCurrency(totalBalance)" 
        icon="pi pi-wallet" 
        color="text-green-500" 
        bg="bg-green-100" 
      />
      <StatsCard 
        title="Income" 
        :amount="formatCurrency(transactionStore.totalIncome)" 
        icon="pi pi-arrow-up" 
        color="text-emerald-500" 
        bg="bg-emerald-100" 
      />
      <StatsCard 
        title="Expenses" 
        :amount="formatCurrency(transactionStore.totalExpenses)" 
        icon="pi pi-arrow-down" 
        color="text-red-500" 
        bg="bg-red-100" 
      />
      <StatsCard 
        title="Net Savings" 
        :amount="formatCurrency(transactionStore.netSavings)" 
        icon="pi pi-star-fill" 
        color="text-blue-500" 
        bg="bg-blue-100" 
      />
    </div>

    <!-- Rest stays the same... -->
    <div class="middle-grid">
      <div class="card-panel">
        <BudgetProgress />
      </div>
      <div class="card-panel quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <Button label="Add Transaction" @click="$router.push('/transactions')" icon="pi pi-plus" class="p-button-primary w-full" />
          <Button label="Add Budget" @click="$router.push('/budgets')" icon="pi pi-chart-pie" class="p-button-success w-full" />
          <Button label="Manage Accounts"@click="$router.push('/accounts')" icon="pi pi-home" class="p-button-danger w-full" />
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="card-panel">
        <RecentTransactions />
      </div>
      <div class="card-panel">
        <SpendingChart />
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.text-secondary { color: #6c757d; }

/* GRIDS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 Equal Columns */
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.middle-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 2/3 width and 1/3 width */
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 Equal columns */
  gap: 1.5rem;
}

.card-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid, .middle-grid, .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
