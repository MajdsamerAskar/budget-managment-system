<script setup>
import { useTransactionStore } from '@/stores/transactionStore'; // Assuming existence
import Tag from 'primevue/tag';

const transactionStore = useTransactionStore();
// Helper for icon background
const getIconBg = (type) => type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
const getIcon = (type) => type === 'income' ? 'pi pi-arrow-down' : 'pi pi-shopping-cart';
</script>

<template>
  <div>
    <div class="header">
      <h3>Recent Transactions</h3>
      <span class="text-link">View All</span>
    </div>

    <ul class="transaction-list">
      <!-- Limit to 5 items -->
      <li v-for="t in transactionStore.transactions.slice(0, 5)" :key="t.id" class="t-item">
        <div class="left">
          <div class="icon-circle" :class="getIconBg(t.is_expense ? 'expense' : 'income')">
            <i :class="getIcon(t.is_expense ? 'expense' : 'income')"></i>
          </div>
          <div>
            <p class="t-title">{{ t.title }}</p>
            <p class="t-date">{{ new Date(t.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
        <div class="right">
          <span :class="t.is_expense ? 'text-red' : 'text-green'">
            {{ t.is_expense ? '-' : '+' }}${{ t.amount }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.text-link { color: #3b82f6; cursor: pointer; font-size: 0.9rem; }
.transaction-list { list-style: none; padding: 0; }
.t-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
.left { display: flex; align-items: center; gap: 1rem; }
.icon-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.t-title { font-weight: 600; margin: 0; }
.t-date { font-size: 0.8rem; color: #94a3b8; margin: 0; }
.text-red { color: #ef4444; font-weight: bold; }
.text-green { color: #10b981; font-weight: bold; }
.bg-red-100 { background: #fee2e2; color: #ef4444; }
.bg-green-100 { background: #d1fae5; color: #10b981; }
</style>