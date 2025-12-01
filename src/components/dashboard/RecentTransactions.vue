<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category?.name || 'Uncategorized';
};

// Helper for icon background
const getIconBg = (type) => 
  type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';

const getIcon = (type) => 
  type === 'Income' ? 'pi pi-arrow-down' : 'pi pi-shopping-cart';

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get recent transactions (top 10)
const recentTransactions = computed(() => 
  transactionStore.transactions.slice(0, 10)
);
</script>

<template>
  <div>
    <div class="header">
      <h3>Recent Transactions</h3>
    </div>

    <ul class="transaction-list">
      <li v-if="recentTransactions.length === 0" class="empty-state">
        <p>No transactions yet. Add your first transaction!</p>
      </li>
      
      <li v-for="t in recentTransactions" :key="t.id" class="t-item">
        <div class="left">
          <div class="icon-circle" :class="getIconBg(t.transaction_type)">
            <i :class="getIcon(t.transaction_type)"></i>
          </div>
          <div>
            <p class="t-title">{{ t.description }}</p>
            <p class="t-date">
              {{ getCategoryName(t.category_id) }} • 
              {{ new Date(t.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }) }}
            </p>
          </div>
        </div>
        <div class="right">
          <span :class="t.transaction_type === 'Expense' ? 'text-red' : 'text-green'">
            {{ t.transaction_type === 'Income' ? '+' : '-' }}{{ formatCurrency(t.amount) }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 1rem; 
}

.header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.text-link { 
  color: #3b82f6; 
  cursor: pointer; 
  font-size: 0.875rem;
  font-weight: 500;
}

.text-link:hover {
  text-decoration: underline;
}

.transaction-list { 
  list-style: none; 
  padding: 0; 
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state p {
  margin: 0;
}

.t-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 0.875rem 0; 
  border-bottom: 1px solid #f1f5f9; 
}

.t-item:last-child {
  border-bottom: none;
}

.left { 
  display: flex; 
  align-items: center; 
  gap: 0.875rem; 
}

.icon-circle { 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
}

.t-title { 
  font-weight: 600; 
  margin: 0;
  font-size: 0.9375rem;
}

.t-date { 
  font-size: 0.8125rem; 
  margin: 0.25rem 0 0 0;
}

.text-red { 
  color: #ef4444; 
  font-weight: 600;
  font-size: 0.9375rem;
}

.text-green { 
  color: #10b981; 
  font-weight: 600;
  font-size: 0.9375rem;
}

.bg-red-100 { 
  background: #fee2e2; 
  color: #ef4444; 
}

.bg-green-100 { 
  background: #d1fae5; 
  color: #10b981; 
}
</style>