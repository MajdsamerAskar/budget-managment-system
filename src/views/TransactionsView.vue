<script setup>
import { onMounted, ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore';
import { useBudgetStore } from '@/stores/budgetStore';
import { supabase } from '@/lib/supabase';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

// Components
import StatsCard from '@/components/dashboard/StatsCard.vue';
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue';
import TransactionFilters from '@/components/transactions/TransactionFilters.vue';
import TransactionsList from '@/components/transactions/TransactionsList.vue';
import TransactionDialog from '@/components/transactions/TransactionDialog.vue';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const budgetStore = useBudgetStore();
const confirm = useConfirm();
const toast = useToast();

const transactionDialog = ref();

onMounted(() => {
  transactionStore.fetchTransactions();
  categoryStore.fetchCategories();
  accountStore.fetchAccounts();
  budgetStore.fetchBudgets();
});

// Format currency helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Computed stats
const totalIncome = computed(() => transactionStore.totalIncome);
const totalExpenses = computed(() => transactionStore.totalExpenses);
const netBalance = computed(() => transactionStore.netSavings);
const transactionCount = computed(() => transactionStore.transactions.length);

// Open dialog for adding
const openAddDialog = () => {
  transactionDialog.value?.open();
};

// Open dialog for editing
const handleEdit = (transaction) => {
  transactionDialog.value?.open(transaction);
};

// Handle save (add or edit)
const handleSave = async (data, isEdit) => {
  try {
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = { ...data, user_id: user.id };
    delete payload.id; // Remove id from payload

    if (isEdit) {
      await transactionStore.updateTransaction(data.id, payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Updated', 
        detail: 'Transaction updated successfully', 
        life: 3000 
      });
    } else {
      // Store handles account & budget updates automatically
      await transactionStore.addTransaction(payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Created', 
        detail: 'Transaction added successfully', 
        life: 3000 
      });
    }
  } catch (err) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: err.message, 
      life: 3000 
    });
  }
};

// Handle delete with confirmation
const handleDelete = (transaction) => {
  confirm.require({
    message: `Are you sure you want to delete this transaction?`,
    header: 'Delete Transaction',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        // Store handles account & budget reversals automatically
        await transactionStore.deleteTransaction(transaction.id);
        toast.add({ 
          severity: 'success', 
          summary: 'Deleted', 
          detail: 'Transaction deleted successfully', 
          life: 3000 
        });
      } catch (err) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: transactionStore.error || 'Failed to delete transaction', 
          life: 3000 
        });
      }
    }
  });
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
      <div class="card-panel">
        <RecentTransactions />
      </div>
      <div class="card-panel">
        <TransactionFilters />
      </div>
    </div>

    <!-- 4. BOTTOM SECTION: All Transactions List -->
    <div class="card-panel">
      <TransactionsList 
        @edit="handleEdit" 
        @delete="handleDelete" 
      />
    </div>

    <!-- Add/Edit Transaction Dialog -->
    <TransactionDialog 
      ref="transactionDialog"
      @save="handleSave"
    />

    <!-- Confirm Dialog & Toast -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<style scoped>
.transactions-container {
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