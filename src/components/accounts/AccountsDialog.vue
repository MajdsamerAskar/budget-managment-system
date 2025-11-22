<template>
  <Dialog 
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="editMode ? 'Edit Account' : 'Add Account'"
    :modal="true"
    :style="{ width: '450px' }"
  >
    <div class="dialog-content">
      <div class="field">
        <label for="account_name">Account Name *</label>
        <InputText 
          id="account_name"
          :modelValue="formData.account_name"
          @update:modelValue="formData.account_name = $event"
          placeholder="e.g., Main Bank Account"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="type">Account Type *</label>
        <Dropdown
          id="type"
          :modelValue="formData.type"
          @update:modelValue="formData.type = $event"
          :options="accountTypes"
          placeholder="Select account type"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="balance">Initial Balance *</label>
        <InputNumber
          id="balance"
          :modelValue="formData.balance"
          @update:modelValue="formData.balance = $event"
          mode="currency"
          currency="USD"
          locale="en-US"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button 
        label="Cancel" 
        @click="handleClose"
        text
        severity="secondary"
      />
      <Button 
        :label="editMode ? 'Update' : 'Create'" 
        @click="handleSave"
        :disabled="!isFormValid"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

const props = defineProps<{
  visible: boolean
  editMode: boolean
  formData: {
    account_name: string
    type: '' | 'Bank' | 'Wallet' | 'Credit'
    balance: number
  }
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: []
  close: []
}>();

const accountTypes = ['Bank', 'Wallet', 'Credit'];

const isFormValid = computed(() => {
  return props.formData.account_name.trim() !== '' && 
         props.formData.type !== '';
});

const handleSave = () => {
  if (isFormValid.value) {
    emit('save');
  }
};

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: var(--surface-700);
  font-size: 0.9rem;
}
</style>