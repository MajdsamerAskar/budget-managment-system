<!-- TransactionsView.vue -->
<script setup>
import { onMounted, ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore'; // Assuming you have this

// Components
import StatsCard from '@/components/dashboard/StatsCard.vue';
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue';
import TransactionFilters from '@/components/transactions/TransactionFilters.vue';
import TransactionsList from '@/components/transactions/TransactionsList.vue';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog.vue';
import Button from 'primevue/button';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const showAddDialog = ref(false);

onMounted(() => {
  transactionStore.fetchTransactions();
  categoryStore.fetchCategories();
  accountStore.fetchAccounts();
});

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Computed stats - adjust based on your transactionStore structure
const totalIncome = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpenses = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const netBalance = computed(() => {
  return totalIncome.value - totalExpenses.value;
});

const transactionCount = computed(() => {
  return transactionStore.transactions.length;
});

const openAddDialog = () => {
  showAddDialog.value = true;
};

const handleTransactionAdded = () => {
  showAddDialog.value = false;
  transactionStore.fetchTransactions();
};
</script>

<template>
  <div class="transactions-container">
    
    <!-- 1. HEADER SECTION -->
    <div class="header-section">
      <div>
        <h1>Transactions</h1>
        <p class="text-secondary">Track all your income and expenses in one place.</p>
      </div>
      <Button label="Add Transaction" icon="pi pi-plus" @click="openAddDialog" />
    </div>

    <!-- 2. STATS CARDS ROW -->
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
      <StatsCard 
        title="Net Balance" 
        :amount="formatCurrency(netBalance)" 
        icon="pi pi-wallet" 
        color="text-blue-500" 
        bg="bg-blue-100" 
      />
      <StatsCard 
        title="Total Transactions" 
        :amount="transactionCount.toString()" 
        icon="pi pi-list" 
        color="text-purple-500" 
        bg="bg-purple-100" 
      />
    </div>

    <!-- 3. MIDDLE SECTION: Recent Transactions & Filters -->
    <div class="middle-grid">
      <!-- Left: Recent Transactions -->
      <div class="card-panel">
        <RecentTransactions />
      </div>

      <!-- Right: Filters & Quick Stats -->
      <div class="card-panel">
        <TransactionFilters />
      </div>
    </div>

    <!-- 4. BOTTOM SECTION: All Transactions List -->
    <div class="card-panel">
      <TransactionsList @edit-transaction="openAddDialog" />
    </div>

    <!-- Add Transaction Dialog -->
    <AddTransactionDialog 
      v-model:visible="showAddDialog" 
      @transaction-added="handleTransactionAdded"
    />

  </div>
</template>

<style scoped>
.transactions-container {
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

.text-secondary { 
  color: #6c757d; 
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
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
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