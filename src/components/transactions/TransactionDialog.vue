<script setup>
import { ref, computed, watch } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAccountStore } from '@/stores/accountStore';
import { useBudgetStore } from '@/stores/budgetStore';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import SelectButton from 'primevue/selectbutton';

const visible = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);

const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const budgetStore = useBudgetStore();

const emit = defineEmits(['save']);

const defaultForm = {
  transaction_type: 'Expense',
  description: '',
  amount: null,
  category_id: null,
  account_id: null,
  budget_id: null,
  payment_method: 'Cash',
  date: new Date()
};

const formData = ref({ ...defaultForm });

const typeOptions = [
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' }
];

const paymentMethodOptions = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Payment', 'Check'];

const categoryOptions = computed(() => 
  categoryStore.categories
    .filter(cat => cat.type === formData.value.transaction_type)
    .map(cat => ({ label: cat.name, value: cat.id }))
);

const accountOptions = computed(() => 
  accountStore.accounts.map(acc => ({
    label: `${acc.account_name} (${acc.type}) - ${formatCurrency(acc.balance)}`,
    value: acc.id
  }))
);

const budgetOptions = computed(() => {
  if (formData.value.transaction_type !== 'Expense' || !formData.value.category_id) return [];
  
  return budgetStore.budgets
    .filter(budget => budget.category_id === formData.value.category_id)
    .map(budget => ({
      label: `${budget.name} (${formatCurrency(budget.total_amount - budget.spent)} left)`,
      value: budget.id
    }));
});

const showBudgetField = computed(() => 
  formData.value.transaction_type === 'Expense' && budgetOptions.value.length > 0
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

watch(() => formData.value.transaction_type, () => {
  formData.value.category_id = null;
  formData.value.budget_id = null;
});

watch(() => formData.value.category_id, () => {
  formData.value.budget_id = null;
});

const open = (transaction) => {
  if (transaction) {
    isEditMode.value = true;
    editingId.value = transaction.id;
    formData.value = {
      transaction_type: transaction.transaction_type,
      description: transaction.description || '',
      amount: transaction.amount,
      category_id: transaction.category_id,
      account_id: transaction.account_id,
      budget_id: transaction.budget_id || null,
      payment_method: transaction.payment_method || 'Cash',
      date: transaction.date ? new Date(transaction.date) : new Date()
    };
  } else {
    isEditMode.value = false;
    editingId.value = null;
    formData.value = { ...defaultForm };
  }
  visible.value = true;
};

const close = () => {
  visible.value = false;
  setTimeout(() => formData.value = { ...defaultForm }, 300);
};

const isValid = computed(() => {
  return formData.value.description?.trim() && 
         formData.value.amount > 0 && 
         formData.value.category_id && 
         formData.value.account_id && 
         formData.value.payment_method && 
         formData.value.date;
});

const formatDateForDB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const handleSubmit = () => {
  if (!isValid.value) return;

  const data = {
    ...formData.value,
    date: formatDateForDB(formData.value.date),
    id: editingId.value
  };

  emit('save', data, isEditMode.value);
  close();
};

defineExpose({ open, close });
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="isEditMode ? 'Edit Transaction' : 'Add Transaction'" :style="{ width: '550px' }">
    <div class="form-container">
      <div class="field">
        <label>Type *</label>
        <SelectButton v-model="formData.transaction_type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full" />
      </div>

      <div class="field">
        <label for="description">Description *</label>
        <InputText id="description" v-model="formData.description" placeholder="e.g., Grocery shopping" class="w-full" />
      </div>

      <div class="field">
        <label for="amount">Amount *</label>
        <InputNumber id="amount" v-model="formData.amount" mode="currency" currency="USD" class="w-full" />
      </div>

      <div class="field">
        <label for="category">Category *</label>
        <Dropdown id="category" v-model="formData.category_id" :options="categoryOptions" optionLabel="label" optionValue="value" placeholder="Select category" class="w-full" showClear />
        <small v-if="categoryOptions.length === 0" class="text-muted">No categories available</small>
      </div>

      <div class="field">
        <label for="account">Account *</label>
        <Dropdown id="account" v-model="formData.account_id" :options="accountOptions" optionLabel="label" optionValue="value" placeholder="Select account" class="w-full" showClear />
      </div>

      <div class="field">
        <label for="payment_method">Payment Method *</label>
        <Dropdown id="payment_method" v-model="formData.payment_method" :options="paymentMethodOptions" placeholder="Select method" class="w-full" />
      </div>

      <div v-if="showBudgetField" class="field">
        <label for="budget">Budget (Optional)</label>
        <Dropdown id="budget" v-model="formData.budget_id" :options="budgetOptions" optionLabel="label" optionValue="value" placeholder="Link to budget" class="w-full" showClear />
      </div>

      <div class="field">
        <label for="date">Date *</label>
        <Calendar id="date" v-model="formData.date" dateFormat="yy-mm-dd" class="w-full" showIcon />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="close" text severity="secondary" />
      <Button :label="isEditMode ? 'Update' : 'Add'" icon="pi pi-check" @click="handleSubmit" :disabled="!isValid" />
    </template>
  </Dialog>
</template>

<style scoped>
.form-container { display: flex; flex-direction: column; gap: 1.5rem; padding: 1rem 0; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-weight: 600; font-size: 0.875rem; color: #495057; }
.text-muted { font-size: 0.75rem; color: #6c757d; font-style: italic; }
.w-full { width: 100%; }
</style>