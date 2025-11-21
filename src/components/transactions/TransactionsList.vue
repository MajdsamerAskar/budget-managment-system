<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const emit = defineEmits(['edit-transaction']);

const transactionStore = useTransactionStore();

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getTypeSeverity = (type) => {
  return type === 'income' ? 'success' : 'danger';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleEdit = (transaction) => {
  emit('edit-transaction', transaction);
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    await transactionStore.deleteTransaction(id);
  }
};
</script>

<template>
  <div class="transactions-list">
    <div class="section-header">
      <h3>All Transactions</h3>
      <div class="table-actions">
        <Button label="Filter" icon="pi pi-filter" size="small" outlined />
        <Button label="Export" icon="pi pi-download" size="small" outlined />
      </div>
    </div>

    <DataTable 
      :value="transactionStore.transactions" 
      :loading="transactionStore.isLoading"
      stripedRows 
      paginator 
      :rows="15"
      responsiveLayout="scroll"
      :emptyMessage="'No transactions found. Add your first transaction to get started!'"
      sortField="date"
      :sortOrder="-1"
    >
      <Column field="date" header="Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
      <Column field="description" header="Description" sortable></Column>
      <Column field="category_id" header="Category">
        <template #body="{ data }">
          <span class="category-badge">{{ data.category?.name || 'Uncategorized' }}</span>
        </template>
      </Column>
      <Column field="type" header="Type" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.type" 
            :severity="getTypeSeverity(data.type)"
          />
        </template>
      </Column>
      <Column field="amount" header="Amount" sortable>
        <template #body="{ data }">
          <span :class="data.type === 'income' ? 'amount-income' : 'amount-expense'">
            {{ data.type === 'income' ? '+' : '-' }}{{ formatCurrency(data.amount) }}
          </span>
        </template>
      </Column>
      <Column field="account_id" header="Account">
        <template #body="{ data }">
          {{ data.account?.name || 'N/A' }}
        </template>
      </Column>
      <Column header="Actions" :exportable="false">
        <template #body="{ data }">
          <div class="action-buttons-row">
            <Button 
              icon="pi pi-pencil" 
              size="small" 
              text 
              @click="handleEdit(data)"
            />
            <Button 
              icon="pi pi-trash" 
              size="small" 
              text 
              severity="danger"
              @click="handleDelete(data.id)"
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

.category-badge {
  background: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.amount-income {
  color: #10b981;
  font-weight: 600;
}

.amount-expense {
  color: #ef4444;
  font-weight: 600;
}

.action-buttons-row {
  display: flex;
  gap: 0.25rem;
}
</style>