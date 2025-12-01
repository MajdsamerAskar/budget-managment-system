<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="sidebar-header">
      <i class="pi pi-wallet brand-icon"></i>
      <h2>BUDGET PRO</h2>
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
    
    <!-- Footer with Theme Toggle and Logout -->
    <div class="sidebar-footer">
      <div class="footer-actions">
        <ThemeToggle />
        <Button 
          icon="pi pi-sign-out" 
          @click="logout"
          severity="secondary"
          text
          v-tooltip.top="'Logout'"
          class="logout-btn"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import ThemeToggle from '@/components/ThemeToggle.vue';

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
    await authStore.signOut();
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
  background-color: var(--bg-card);
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.brand-icon {
  font-size: 1.75rem;
  color: var(--color-primary);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: 0.5px;
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
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 6px;
  transition: all 0.2s;
  font-weight: 500;
}

.menu-item-link:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.menu-item-link.router-link-active {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  width: 100%;
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-around;
}

.logout-btn {
  width: 2.5rem;
  height: 2.5rem;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .sidebar-header {
    padding: 1rem;
  }

  .sidebar-header h2 {
    font-size: 1.25rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }
}
</style>