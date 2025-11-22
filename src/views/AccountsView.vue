<template>
  <div class="accounts-view">
    <AccountsHeader @add-account="openAddDialog" />
    
    <div v-if="accountStore.isLoading" class="loading-container">
      <ProgressSpinner />
      <p>Loading accounts...</p>
    </div>

    <div v-else-if="accountStore.error" class="error-container">
      <Message severity="error" :closable="false">
        {{ accountStore.error }}
      </Message>
      <Button label="Retry" icon="pi pi-refresh" @click="accountStore.fetchAccounts()" />
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
      :saving="saving"
      @save="handleSaveAccount"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Button from 'primevue/button';
import AccountsHeader from '@/components/accounts/AccountsHeader.vue';
import AccountsGrid from '@/components/accounts/AccountsGrid.vue';
import AccountDialog from '@/components/accounts/AccountsDialog.vue';
import { useAccountStore } from '@/stores/accountStore';
import { useAuthStore } from '@/stores/authStore';
import type { Account } from '@/types/types';

const toast = useToast();
const accountStore = useAccountStore();
const authStore = useAuthStore();
const saving = ref(false);

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

const handleDeleteAccount = async (id: string) => {
  if (!confirm('Are you sure you want to delete this account?')) {
    return;
  }

  try {
    await accountStore.deleteAccount(id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Account deleted successfully',
      life: 3000
    });
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: accountStore.error || 'Failed to delete account',
      life: 3000
    });
  }
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

  console.log('Saving account with data:', formData.value);
  saving.value = true;

  try {
    if (editMode.value && editingId.value !== null) {
      // Update existing account
      console.log('Updating account:', editingId.value);
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
      // Create new account
      console.log('Creating new account');
      
      // Get user ID from auth store
      const userId = authStore.user?.id;
      if (!userId) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User not authenticated',
          life: 3000
        });
        return;
      }
      
      const newAccountData = {
        user_id: userId,
        account_name: formData.value.account_name,
        type: formData.value.type as "Bank" | "Wallet" | "Credit",
        balance: formData.value.balance
      };
      console.log('New account data:', newAccountData);
      
      await accountStore.addAccount(newAccountData);

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account created successfully',
        life: 3000
      });
    }

    handleCloseDialog();
  } catch (err: any) {
    console.error('Error saving account:', err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: accountStore.error || 'Failed to save account',
      life: 3000
    });
  } finally {
    saving.value = false;
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

// Load accounts on component mount
onMounted(() => {
  accountStore.fetchAccounts();
});
</script>

<style scoped>
.accounts-view {
  padding: 2rem;
  min-height: 100vh;
  background-color: var(--surface-50);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-container p {
  color: var(--surface-600);
  font-size: 1.1rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .accounts-view {
    padding: 1rem;
  }
}
</style>