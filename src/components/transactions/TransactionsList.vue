<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore';
import { useToast } from 'primevue/usetoast'; // Add this import

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const emit = defineEmits(['edit', 'delete']);

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const toast = useToast(); // Add this with your other constants

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getTypeSeverity = (type) => {
  return type === 'Income' ? 'success' : 'danger';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId);
  return category?.name || 'Uncategorized';
};

// Get account name by ID
const getAccountName = (accountId) => {
  const account = accountStore.accounts.find(a => a.id === accountId);
  return account?.account_name || 'N/A';
};
const handleExportData = () => {
  try {
    // Get all transactions
    const transactions = transactionStore.transactions;

    if (!transactions || transactions.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No transactions available to export',
        life: 3000
      });
      return;
    }

    // Prepare CSV data
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Account'];
    
    const csvRows = [
      headers.join(','), // Header row
      ...transactions.map(transaction => {
        const categoryName = getCategoryName(transaction.category_id);
        const accountName = getAccountName(transaction.account_id);
        
        return [
          `"${formatDate(transaction.date)}"`,
          `"${transaction.description}"`,
          `"${categoryName}"`,
          transaction.transaction_type,
          transaction.amount,
          `"${accountName}"`
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
    const filename = `transactions_export_${date}.csv`;
    
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
      detail: 'Failed to export transactions data',
      life: 3000
    });
  }
};
</script>

<template>
  <div class="transactions-list">
    <div class="section-header">
      <h3>All Transactions</h3>
      <div class="table-actions">
        <Button label="Export"  icon="pi pi-download" size="small" outlined @click="handleExportData" />
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
      
      <Column field="description" header="Description" sortable />
      
      <Column field="category_id" header="Category">
        <template #body="{ data }">
          <span class="category-badge">{{ getCategoryName(data.category_id) }}</span>
        </template>
      </Column>
      
      <Column field="transaction_type" header="Type" sortable>
        <template #body="{ data }">
          <Tag 
            :value="data.transaction_type" 
            :severity="getTypeSeverity(data.transaction_type)"
          />
        </template>
      </Column>
      
      <Column field="amount" header="Amount" sortable>
        <template #body="{ data }">
          <span :class="data.transaction_type === 'Income' ? 'amount-income' : 'amount-expense'">
            {{ data.transaction_type === 'Income' ? '+' : '-' }}{{ formatCurrency(data.amount) }}
          </span>
        </template>
      </Column>
      
      <Column field="account_id" header="Account">
        <template #body="{ data }">
          {{ getAccountName(data.account_id) }}
        </template>
      </Column>
      
      <Column header="Actions" :exportable="false">
        <template #body="{ data }">
          <div class="action-buttons-row">
            <Button 
              icon="pi pi-pencil" 
              size="small" 
              text 
              @click="emit('edit', data)"
            />
            <Button 
              icon="pi pi-trash" 
              size="small" 
              text 
              severity="danger"
              @click="emit('delete', data)"
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