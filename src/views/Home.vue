<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUsers, User } from "@/api/user.ts";

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    users.value = await getUsers();
  } catch (err: any) {
    error.value = err.message || "Failed to load users";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-4">
    <div v-if="loading">🔄 Loading users...</div>
    <div v-else-if="error" class="text-red-500">⚠️ {{ error }}</div>
    <ul v-else>
      <li v-for="u in users" :key="u.id">{{ u.name }} — {{ u.email }}</li>
    </ul>
  </div>
  Home Vue
</template>
