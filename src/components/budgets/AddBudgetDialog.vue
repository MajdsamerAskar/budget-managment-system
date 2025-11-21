<script setup>
import { ref, computed } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import { useCategoryStore } from '@/stores/categoryStore';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'budget-added']);

const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const toast = useToast();

const formData = ref({
  name: '',
  total_amount: null,
  start_date: null,
  end_date: null
});

const isSubmitting = ref(false);

const categoryOptions = computed(() => 
  categoryStore.categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
);

const closeDialog = () => {
  emit('update:visible', false);
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: '',
    total_amount: null,
    start_date: null,
    end_date: null
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
    if (!formData.value.name || !formData.value.total_amount || !formData.value.start_date || 
        !formData.value.end_date) {
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000
      });
      return;
    }

    if (formData.value.total_amount <= 0) {
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Amount must be greater than 0',
        life: 3000
      });
      return;
    }

    // Submit to store
    await budgetStore.addBudget({
      name: formData.value.name,
      total_amount: formData.value.total_amount,
      start_date: formatDateForDB(formData.value.start_date),
      end_date: formatDateForDB(formData.value.end_date)
    });

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Budget created successfully',
      life: 3000
    });

    emit('budget-added');
    closeDialog();
  } catch (error) {
    console.error('Error creating budget:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to create budget',
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
``
<template>
  <Dialog
    :visible="visible"
    @update:visible="closeDialog"
    modal
    header="Create New Budget"
    :style="{ width: '500px' }"
  >
    <div class="form-container">
      <div class="field">
        <label for="name">Budget Name *</label>
        <InputText
          id="name"
          v-model="formData.name"
          placeholder="e.g., Monthly Groceries"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="amount">Budget Amount *</label>
        <InputNumber
          id="amount"
          v-model="formData.total_amount"
          mode="currency"
          currency="USD"
          placeholder="$0.00"
          class="w-full"
        />
      </div>
      <div class="field">
        <label for="start_date">Start Date *</label>
        <Calendar
          id="start_date"
          v-model="formData.start_date"
          dateFormat="yy-mm-dd"
          placeholder="Select start date"
          class="w-full"
          showIcon
        />
      </div>

      <div class="field">
        <label for="end_date">End Date *</label>
        <Calendar
          id="end_date"
          v-model="formData.end_date"
          dateFormat="yy-mm-dd"
          placeholder="Select end date"
          class="w-full"
          showIcon
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
        label="Create Budget"
        icon="pi pi-check"
        @click="handleSubmit"
        :loading="isSubmitting"
      />
    </template>
  </Dialog>``
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