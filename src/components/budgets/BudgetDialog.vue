<script setup>
import { ref, computed, watch } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useToast } from 'primevue/usetoast';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  visible: Boolean,
  budgetToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'saved']);

const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const toast = useToast();

const formData = ref({
  name: '',
  total_amount: null,
  category_id: null,
  start_date: null,
  end_date: null
});

const isSubmitting = ref(false);

// Filter Categories: Only show 'Expense' types
const categoryOptions = computed(() => 
  categoryStore.categories
    .filter(cat => cat.type === 'Expense')
    .map(cat => ({
      label: cat.name,
      value: cat.id
    }))
);

// Watch for dialog visibility changes
watch(() => props.visible, (isVisible) => {
  if (isVisible && props.budgetToEdit) {
    // EDIT MODE: Populate form
    try {
      formData.value = {
        name: props.budgetToEdit.name || '',
        total_amount: props.budgetToEdit.total_amount || null,
        category_id: props.budgetToEdit.category_id || null,
        start_date: props.budgetToEdit.start_date ? new Date(props.budgetToEdit.start_date) : null,
        end_date: props.budgetToEdit.end_date ? new Date(props.budgetToEdit.end_date) : null
      };
    } catch (error) {
      console.error('Error populating form:', error);
      resetForm();
    }
  } else if (isVisible && !props.budgetToEdit) {
    // CREATE MODE: Reset form
    resetForm();
  }
});

const closeDialog = () => {
  emit('update:visible', false);
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: '',
    total_amount: null,
    category_id: null,
    start_date: null,
    end_date: null
  };
};

const formatDateForDB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // 1. Validate
    if (!formData.value.name || 
        !formData.value.total_amount || 
        !formData.value.category_id || 
        !formData.value.start_date || 
        !formData.value.end_date) {
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
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

    // 2. Prepare Payload
    const payload = {
      name: formData.value.name,
      total_amount: formData.value.total_amount,
      category_id: formData.value.category_id,
      start_date: formatDateForDB(formData.value.start_date),
      end_date: formatDateForDB(formData.value.end_date),
    };

    // 3. Submit (Update vs Create)
    if (props.budgetToEdit) {
      // --- UPDATE ---
      await budgetStore.updateBudget(props.budgetToEdit.id, payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Updated', 
        detail: 'Budget updated successfully', 
        life: 3000 
      });
    } else {
      // --- CREATE ---
      await budgetStore.addBudget({ ...payload, spent: 0 });
      toast.add({ 
        severity: 'success', 
        summary: 'Created', 
        detail: 'Budget created successfully', 
        life: 3000 
      });
    }

    // 4. Cleanup
    emit('saved');
    closeDialog();

  } catch (error) {
    console.error('Error saving budget:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save budget',
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
    :header="props.budgetToEdit ? 'Edit Budget' : 'Create New Budget'"
    :style="{ width: '500px' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
  >
    <div class="form-container">
      
      <!-- Budget Name -->
      <div class="field">
        <label for="name">Budget Name *</label>
        <InputText
          id="name"
          v-model="formData.name"
          placeholder="e.g., Summer Vacation"
          class="w-full"
        />
      </div>

      <!-- Category Selection -->
      <div class="field">
        <label for="category">Category (Expenses Only) *</label>
        <Dropdown
          id="category"
          v-model="formData.category_id"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select an Expense Category"
          class="w-full"
          filter
          :showClear="true"
        />
        <small v-if="categoryOptions.length === 0" class="text-secondary">
          No expense categories found. Please create one first.
        </small>
      </div>

      <!-- Budget Amount -->
      <div class="field">
        <label for="amount">Budget Amount *</label>
        <InputNumber
          id="amount"
          v-model="formData.total_amount"
          mode="currency"
          currency="USD"
          locale="en-US"
          placeholder="$0.00"
          class="w-full"
        />
      </div>

      <!-- Start Date -->
      <div class="field">
        <label for="start_date">Start Date *</label>
        <Calendar
          id="start_date"
          v-model="formData.start_date"
          dateFormat="yy-mm-dd"
          placeholder="YYYY-MM-DD"
          class="w-full"
          showIcon
        />
      </div>

      <!-- End Date -->
      <div class="field">
        <label for="end_date">End Date *</label>
        <Calendar
          id="end_date"
          v-model="formData.end_date"
          dateFormat="yy-mm-dd"
          placeholder="YYYY-MM-DD"
          class="w-full"
          showIcon
          :minDate="formData.start_date" 
        />
      </div>

    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="closeDialog"
        text
        severity="secondary"
      />
      <Button
        :label="props.budgetToEdit ? 'Save Changes' : 'Create Budget'"
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
  padding: 0.5rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  font-size: 0.875rem;
}

.text-secondary {
  font-size: 0.75rem;
}

.w-full {
  width: 100%;
}
</style>