<template>
  <div>
    <Card class="account-card">
      <template #header>
        <div class="card-header">
          <i :class="getAccountIcon(account.type)" class="account-icon"></i>
          <div class="card-actions">
            <Button 
              icon="pi pi-pencil" 
              style="color: white;"
              @click="$emit('edit')"
              text
              rounded
              severity="secondary"
            />
            <Button 
              icon="pi pi-trash" 
              @click="$emit('delete')"
              text
              rounded
              severity="danger"
            />
          </div>
        </div>
      </template>
      <template #title>
        {{ account.account_name }}
      </template>
      <template #subtitle>
        {{ account.type }}
      </template>
      <template #content>
        <div class="account-balance">
          <span class="balance-label">Balance:</span>
          <span class="balance-amount" :class="account.balance >= 0 ? 'positive' : 'negative'">
            ${{ account.balance.toFixed(2) }}
          </span>
        </div>
        <div class="account-meta">
          <small>Created: {{ new Date(account.created_at).toLocaleDateString() }}</small>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import type { Account } from '@/types/types';

defineProps<{
  account: Account
}>();

defineEmits<{
  edit: []
  delete: []
}>();

const getAccountIcon = (type: "Bank" | "Wallet" | "Credit") => {
  switch(type) {
    case 'Bank': return 'pi pi-building';
    case 'Wallet': return 'pi pi-wallet';
    case 'Credit': return 'pi pi-credit-card';
    default: return 'pi pi-wallet';
  }
};
</script>

<style scoped>
.account-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.account-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.account-icon {
  font-size: 2rem;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
  color: white !important;
}

.account-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--surface-100);
  border-radius: 6px;
}

.balance-label {
  font-weight: 600;
  color: var(--surface-700);
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
}

.balance-amount.positive {
  color: var(--green-600);
}

.balance-amount.negative {
  color: var(--red-600);
}

.account-meta {
  color: var(--surface-500);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>