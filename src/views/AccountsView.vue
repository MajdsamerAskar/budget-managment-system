<template>
  <div class="accounts-view">
    <AccountsHeader @add-account="openAddDialog" />
    
    <div v-if="accountStore.isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Loading accounts...</p>
    </div>

    <div v-else-if="accountStore.accounts.length === 0" class="empty-state">
      <i class="pi pi-wallet"></i>
      <h3>No Accounts Yet</h3>
      <p>Create your first account to start tracking your finances</p>
      <Button label="Add Account" icon="pi pi-plus" @click="openAddDialog" />
    </div>

    <AccountsGrid 
      v-else
      :accounts="accountStore.accounts"
      @edit-account="handleEditAccount"
      @delete-account="handleDeleteAccount"
    />

    <AccountDialog
      v-model:visible="showDialog"
      :edit-mode="editMode"
      :form-data="formData"
      :is-submitting="accountStore.isLoading"
      @save="handleSaveAccount"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import AccountsHeader from '@/components/accounts/AccountsHeader.vue';
import AccountsGrid from '@/components/accounts/AccountsGrid.vue';
import AccountDialog from '@/components/accounts/AccountsDialog.vue';
import Button from 'primevue/button';
import type { Account } from '@/types/types';

const accountStore = useAccountStore();
const toast = useToast();
const confirm = useConfirm();

const showDialog = ref(false);
const editMode = ref(false);
const editingId = ref<string | null>(null);

const formData = ref({
  account_name: '',
  type: '' as '' | 'Bank' | 'Wallet' | 'Credit',
  balance: 0
});

onMounted(async () => {
  await accountStore.fetchAccounts();
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
  confirm.require({
    message: 'Are you sure you want to delete this account? This action cannot be undone.',
    header: 'Delete Account',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await accountStore.deleteAccount(id);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account deleted successfully',
          life: 3000
        });
      } catch (error: any) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete account',
          life: 3000
        });
      }
    }
  });
};

const handleSaveAccount = async () => {
  // Validate form data
  if (!formData.value.account_name.trim() || !formData.value.type) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000
    });
    return;
  }

  try {
    if (editMode.value && editingId.value !== null) {
      // Update existing account
      await accountStore.updateAccount(editingId.value, {
        account_name: formData.value.account_name,
        type: formData.value.type as "Bank" | "Wallet" | "Credit",
        balance: formData.value.balance
      });
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account updated successfully',
        life: 3000
      });
    } else {
      // Add new account
      await accountStore.addAccount({
        account_name: formData.value.account_name,
        type: formData.value.type as "Bank" | "Wallet" | "Credit",
        balance: formData.value.balance
      });
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account created successfully',
        life: 3000
      });
    }

    handleCloseDialog();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save account',
      life: 3000
    });
  }
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

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-state i {
  font-size: 3rem;
  color: var(--primary-500);
  margin-bottom: 1rem;
}

.empty-state i {
  font-size: 4rem;
  color: var(--surface-400);
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--surface-700);
}

.empty-state p {
  color: var(--surface-500);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .accounts-view {
    padding: 1rem;
  }
}
</style>