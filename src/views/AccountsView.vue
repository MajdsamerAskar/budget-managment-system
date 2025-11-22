<template>
  <div class="accounts-view">
    <AccountsHeader @add-account="openAddDialog" />
    
    <AccountsGrid 
      :accounts="accounts"
      @edit-account="handleEditAccount"
      @delete-account="handleDeleteAccount"
    />

    <AccountDialog
      v-model:visible="showDialog"
      :edit-mode="editMode"
      :form-data="formData"
      @save="handleSaveAccount"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountsHeader from '@/components/accounts/AccountsHeader.vue';
import AccountsGrid from '@/components/accounts/AccountsGrid.vue';
import AccountDialog from '@/components/accounts/AccountsDialog.vue';
import type { Account } from '@/types/types';

const accounts = ref<Account[]>([
  {
    id: '1',
    user_id: 'user_123',
    account_name: 'Main Checking',
    type: 'Bank',
    balance: 2500.00,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user_123',
    account_name: 'Main Wallet',
    type: 'Wallet',
    balance: 500.00,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'user_123',
    account_name: 'Credit Card',
    type: 'Credit',
    balance: -450.00,
    created_at: new Date().toISOString()
  }
]);

const showDialog = ref(false);
const editMode = ref(false);
const editingId = ref<string | null>(null);

const formData = ref({
  account_name: '',
  type: '' as '' | 'Bank' | 'Wallet' | 'Credit',
  balance: 0
});

const openAddDialog = () => {
  editMode.value = false;
  editingId.value = null;
  formData.value = {
    account_name: '',
    type: '' as '',
    balance: 0
  };
  showDialog.value = true;
};

const handleEditAccount = (account: Account) => {
  editMode.value = true;
  editingId.value = account.id;
  formData.value = {
    account_name: account.account_name,
    type: account.type,
    balance: account.balance
  };
  showDialog.value = true;
};

const handleDeleteAccount = (id: string) => {
  if (confirm('Are you sure you want to delete this account?')) {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  }
};

const handleSaveAccount = () => {
  // Validate form data
  if (!formData.value.account_name.trim() || !formData.value.type) {
    console.log('Form validation failed', formData.value);
    return;
  }

  if (editMode.value && editingId.value !== null) {
    // Update existing account
    const index = accounts.value.findIndex(acc => acc.id === editingId.value);
    if (index !== -1) {
      accounts.value[index] = {
        ...accounts.value[index],
        account_name: formData.value.account_name,
        type: formData.value.type as "Bank" | "Wallet" | "Credit",
        balance: formData.value.balance
      };
    }
    console.log('Account updated', accounts.value);
  } else {
    // Add new account
    const newAccount: Account = {
      id: Date.now().toString(),
      user_id: 'user_123', // This should come from auth store
      account_name: formData.value.account_name,
      type: formData.value.type as "Bank" | "Wallet" | "Credit",
      balance: formData.value.balance,
      created_at: new Date().toISOString()
    };
    accounts.value.push(newAccount);
    console.log('New account added', newAccount);
    console.log('All accounts', accounts.value);
  }

  handleCloseDialog();
};

const handleCloseDialog = () => {
  showDialog.value = false;
  editMode.value = false;
  editingId.value = null;
  formData.value = {
    account_name: '',
    type: '' as '',
    balance: 0
  };
};
</script>

<style scoped>
.accounts-view {
  padding: 2rem;
  min-height: 100vh;
  background-color: var(--surface-50);
}

@media (max-width: 768px) {
  .accounts-view {
    padding: 1rem;
  }
}
</style>