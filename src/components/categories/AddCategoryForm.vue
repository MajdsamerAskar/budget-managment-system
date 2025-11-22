<template>
  <div>
    <!-- Trigger Button -->
    <Button label="Add Category" icon="pi pi-plus" @click="visible = true" />

    <!-- Pop-out Dialog -->
    <Dialog v-model:visible="visible" header="Add New Category" :modal="true" :closable="true" style="width: 400px">
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
  <Button label="Cancel" severity="secondary" text @click="visible = false" />
  <Button label="Save" icon="pi pi-check" type="submit" />
</div>
      </form>
      <small class="text-gray-500">All amounts are in USD.</small>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

const emit = defineEmits<{
  (e: "add", category: object): void;
}>();

const visible = ref(false);

const form = ref({
  name: "",
  type: "Expense",
  description: "",
  color: "",
});

const handleSubmit = () => {
  const newCategory = {
    id: crypto.randomUUID(),
    user_id: "u1", // replace with actual user ID
    name: form.value.name,
    type: form.value.type,
    description: form.value.description,
    color: form.value.color,
    created_at: new Date().toISOString(),
    total: 0,
  };

  emit("add", newCategory);

  // Reset form and close dialog
  form.value = { name: "", type: "Expense", description: "", color: "" };
  visible.value = false;
};
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label{
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
}
</style>