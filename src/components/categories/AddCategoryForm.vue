<template>
  <Dialog 
    v-model:visible="visible" 
    :header="isEditMode ? 'Edit Category' : 'Add New Category'" 
    :modal="true" 
    :closable="true" 
    style="width: 400px"
  >
    <form @submit.prevent="handleSubmit" class="grid gap-3">
      <div class="field">
        <label for="name">Name</label>
        <InputText id="name" v-model="form.name" required />
      </div>

      <div class="field">
        <label for="type">Type</label>
        <Dropdown
          id="type"
          v-model="form.type"
          :options="['Income', 'Expense']"
          placeholder="Select Type"
          required
        />
      </div>

      <div class="field">
        <label for="description">Description</label>
        <InputText id="description" v-model="form.description" />
      </div>

      <div class="field color-picker-row">
        <label for="color">Color</label>
        <div class="color-input-group">
          <input type="color" v-model="form.color" class="color-box" />
          <InputText v-model="form.color" placeholder="#34d399" />
        </div>
      </div>

      <div class="button-row">
        <Button label="Cancel" severity="secondary" text @click="close" />
        <Button 
          :label="isEditMode ? 'Update' : 'Save'" 
          icon="pi pi-check" 
          type="submit" 
          :loading="isLoading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import type { Category } from '@/types/types';

const emit = defineEmits<{
  saved: []
}>();

const visible = ref(false);
const isEditMode = ref(false);
const isLoading = ref(false);
const editingId = ref<string | null>(null);

const defaultForm = {
  name: '',
  type: 'Expense' as 'Income' | 'Expense',
  description: '',
  color: '#34d399'
};

const form = ref({ ...defaultForm });

const open = (category?: Category) => {
  if (category) {
    isEditMode.value = true;
    editingId.value = category.id;
    form.value = {
      name: category.name,
      type: category.type,
      description: category.description || '',
      color: category.color || '#34d399'
    };
  } else {
    isEditMode.value = false;
    editingId.value = null;
    form.value = { ...defaultForm };
  }
  visible.value = true;
};

const close = () => {
  visible.value = false;
  form.value = { ...defaultForm };
};

const handleSubmit = () => {
  emit('saved');
};

defineExpose({ 
  open, 
  close,
  form,
  isEditMode,
  editingId,
  setLoading: (val: boolean) => isLoading.value = val
});
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  margin-top: 10px;
}
.button-row {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.color-picker-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.color-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.color-box {
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
}
</style>