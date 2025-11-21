<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const filters = ref({
  type: null,
  category: null,
  dateRange: null
});

const typeOptions = [
  { label: 'All Types', value: null },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' }
];

const categoryOptions = computed(() => [
  { label: 'All Categories', value: null },
  ...categoryStore.categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
]);

const applyFilters = () => {
  // Apply filters logic - you can emit or update store
  console.log('Applying filters:', filters.value);
};

const clearFilters = () => {
  filters.value = {
    type: null,
    category: null,
    dateRange: null
  };
};
</script>

<template>
  <div class="transaction-filters">
    <h3>Filters</h3>
    
    <div class="filter-group">
      <label>Transaction Type</label>
      <Dropdown
        v-model="filters.type"
        :options="typeOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="All Types"
        class="w-full"
      />
    </div>

    <div class="filter-group">
      <label>Category</label>
      <Dropdown
        v-model="filters.category"
        :options="categoryOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="All Categories"
        class="w-full"
      />
    </div>

    <div class="filter-group">
      <label>Date Range</label>
      <Calendar
        v-model="filters.dateRange"
        selectionMode="range"
        dateFormat="yy-mm-dd"
        placeholder="Select date range"
        class="w-full"
        showIcon
      />
    </div>

    <div class="filter-actions">
      <Button label="Apply" icon="pi pi-check" class="w-full" @click="applyFilters" />
      <Button label="Clear" icon="pi pi-times" class="w-full" outlined @click="clearFilters" />
    </div>

    <div class="quick-stats">
      <h4>Quick Stats</h4>
      <div class="stat-item">
        <span>This Month</span>
        <strong>$2,847.50</strong>
      </div>
      <div class="stat-item">
        <span>Last 7 Days</span>
        <strong>$684.20</strong>
      </div>
      <div class="stat-item">
        <span>Today</span>
        <strong>$125.00</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-filters h3 {
  margin: 0 0 1.5rem 0;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.quick-stats {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.quick-stats h4 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #6c757d;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.stat-item span {
  color: #6c757d;
  font-size: 0.875rem;
}

.stat-item strong {
  color: #212529;
}

.w-full {
  width: 100%;
}
</style>