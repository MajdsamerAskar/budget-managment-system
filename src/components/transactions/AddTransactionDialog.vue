<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import SelectButton from 'primevue/selectbutton';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'transaction-added']);

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const toast = useToast();

const formData = ref({
  transaction_type: 'Expense',
  description: '',
  amount: null,
  category_id: null,
  account_id: null,
  date: new Date(),
  notes: ''
});

const isSubmitting = ref(false);

const typeOptions = [
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' }
];

const categoryOptions = computed(() => 
  categoryStore.categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
);

const accountOptions = computed(() => 
  accountStore.accounts.map(acc => ({
    label: `${acc.account_name} - ${acc.balance.toFixed(2)}`,
    value: acc.id,
    icon: getAccountIcon(acc.type)
  }))
);

const getAccountIcon = (type) => {
  switch(type) {
    case 'Bank': return 'pi pi-building';
    case 'Wallet': return 'pi pi-wallet';
    case 'Credit': return 'pi pi-credit-card';
    default: return 'pi pi-wallet';
  }
};

const closeDialog = () => {
  emit('update:visible', false);
  resetForm();
};

const resetForm = () => {
  formData.value = {
    transaction_type: 'Expense',
    description: '',
    amount: null,
    category_id: null,
    account_id: null,
    date: new Date(),
    notes: ''
  };
};

const formatDateForDB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // Validation
    if (!formData.value.description || !formData.value.amount || 
        !formData.value.account_id || !formData.value.date) {
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000
      });
      return;
    }

    // Validate category only for expenses
    if (formData.value.transaction_type === 'Expense' && !formData.value.category_id) {
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a category for expenses',
        life: 3000
      });
      return;
    }

    if (formData.value.amount <= 0) {
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Amount must be greater than 0',
        life: 3000
      });
      return;
    }

    // Submit to store
    await transactionStore.addTransaction({
      transaction_type: formData.value.transaction_type,
      description: formData.value.description,
      amount: formData.value.amount,
      category_id: formData.value.transaction_type === 'Expense' ? formData.value.category_id : null,
      account_id: formData.value.account_id,
      date: formatDateForDB(formData.value.date),
      notes: formData.value.notes || null
    });

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Transaction added successfully',
      life: 3000
    });

    emit('transaction-added');
    closeDialog();
  } catch (error) {
    console.error('Error adding transaction:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to add transaction',
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="closeDialog"
    modal
    header="Add New Transaction"
    :style="{ width: '550px' }"
  >
    <div class="form-container">
      <div class="field">
        <label>Transaction Type *</label>
        <SelectButton 
          v-model="formData.transaction_type" 
          :options="typeOptions" 
          optionLabel="label" 
          optionValue="value"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="description">Description *</label>
        <InputText
          id="description"
          v-model="formData.description"
          placeholder="e.g., Grocery shopping"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="amount">Amount *</label>
        <InputNumber
          id="amount"
          v-model="formData.amount"
          mode="currency"
          currency="USD"
          placeholder="$0.00"
          class="w-full"
        />
      </div>

      <div class="field" v-if="formData.transaction_type === 'Expense'">
        <label for="category">Category *</label>
        <Dropdown
          id="category"
          v-model="formData.category_id"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a category"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="account">Account *</label>
        <Dropdown
          id="account"
          v-model="formData.account_id"
          :options="accountOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select an account"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="account-dropdown-value">
              <i :class="accountOptions.find(a => a.value === slotProps.value)?.icon"></i>
              <span>{{ accountOptions.find(a => a.value === slotProps.value)?.label }}</span>
            </div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div class="account-dropdown-option">
              <i :class="slotProps.option.icon"></i>
              <span>{{ slotProps.option.label }}</span>
            </div>
          </template>
        </Dropdown>
      </div>

      <div class="field">
        <label for="date">Date *</label>
        <Calendar
          id="date"
          v-model="formData.date"
          dateFormat="yy-mm-dd"
          placeholder="Select date"
          class="w-full"
          showIcon
        />
      </div>

      <div class="field">
        <label for="notes">Notes (Optional)</label>
        <Textarea
          id="notes"
          v-model="formData.notes"
          rows="3"
          placeholder="Add any additional notes..."
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="closeDialog"
        text
      />
      <Button
        label="Add Transaction"
        icon="pi pi-check"
        @click="handleSubmit"
        :loading="isSubmitting"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
}

.w-full {
  width: 100%;
}
</style>