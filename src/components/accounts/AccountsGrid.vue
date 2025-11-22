<template>
  <div class="accounts-grid">
    <AccountCard
      v-for="account in accounts"
      :key="account.id"
      :account="account"
      @edit="$emit('editAccount', account)"
      @delete="$emit('deleteAccount', account.id)"
    />
  </div>
</template>

<script setup lang="ts">
import AccountCard from './AccountsCard.vue';
import type { Account } from '@/types/types';

defineProps<{
  accounts: Account[]
}>();

defineEmits<{
  editAccount: [account: Account]
  deleteAccount: [id: string]
}>();
</script>

<style scoped>
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .accounts-grid {
    grid-template-columns: 1fr;
  }
}
</style>