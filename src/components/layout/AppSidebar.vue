<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="sidebar-header">
      <h2>BMS</h2>
    </div>
    <!-- Menu -->
    <Menu :model="menuItems" class="sidebar-menu">
      <template #item="{ item }">
        <router-link :to="item.to" class="menu-item-link" @click="handleMenuClick">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </template>
    </Menu>
    <!-- Logout Section -->
    <div class="sidebar-footer">
      <Button 
        label="Logout" 
        icon="pi pi-sign-out" 
        @click="logout"
        class="w-full"
        severity="secondary"
        text
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Menu from 'primevue/menu';
import Button from 'primevue/button';

const router = useRouter();
const authStore = useAuthStore();

// Emit event to close sidebar
const emit = defineEmits<{
  close: []
}>();

const menuItems = ref([
  { 
    label: 'Dashboard', 
    to: '/', 
    icon: 'pi pi-home'
  },
  { 
    label: 'Budgets', 
    to: '/budgets', 
    icon: 'pi pi-wallet'
  },
  { 
    label: 'Transactions', 
    to: '/transactions', 
    icon: 'pi pi-chart-line'
  },
  { 
    label: 'Accounts', 
    to: '/accounts', 
    icon: 'pi pi-user'
  },
  { 
    label: 'Categories', 
    to: '/categories', 
    icon: 'pi pi-folder'
  },
]);

// Handle menu click - emit close event
const handleMenuClick = () => {
  emit('close');
};

// Logout Function
const logout = async () => {
  try {
    // Execute the logout action from your store (clears Supabase session)
    await authStore.signOut();
    
    // Redirect user to the login page
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  color: #333;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  background-color: transparent;
  border: none;
  width: 100%;
  padding: 0.5rem;
}

.menu-item-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.menu-item-link:hover {
  background-color: #f3f4f6;
}

.menu-item-link.router-link-active {
  background-color: #e5e7eb;
  color: #1f2937;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.sidebar-footer :deep(.p-button) {
  color: #6b7280;
}

.sidebar-footer :deep(.p-button:hover) {
  background-color: #f3f4f6;
  color: #1f2937;
}
</style>