<template>
  <div class="categories-page">
    <!-- Page Header -->
    <h2>Categories</h2>

    <!-- Totals Summary Blocks -->
   <div class="stats-grid">
  <StatsCard
    title="Total Income"
    :amount="formatCurrency(totalIncome)"
    icon="pi pi-arrow-up"
    color="text-green-500"
    bg="bg-green-100"
  />
  <StatsCard
    title="Total Expenses"
    :amount="formatCurrency(totalExpenses)"
    icon="pi pi-arrow-down"
    color="text-red-500"
    bg="bg-red-100"
  />
</div>

<AddCategoryForm @add="handleAddCategory" />
    <!-- Categories Table -->
    <DataTable :value="categories" responsiveLayout="scroll" class="p-mt-3">
      <Column field="name" header="Category"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="total" header="Total">
  <template #body="slotProps">
    {{ formatCurrency(slotProps.data.total || 0) }}
  </template>
</Column>
    </DataTable>

    <!-- Charts Section -->
    <div class="charts">
      <!-- Income vs Expense -->
      <div class="chart-container">
        <h3>Income vs Expense</h3>
        <Chart type="pie" :data="incomeVsExpenseData" :options="chartOptions" />
      </div>

      <!-- Expense Subcategories -->
      <div class="chart-container">
        <h3>Expense Breakdown</h3>
        <Chart type="pie" :data="expenseChartData" :options="chartOptions" />
      </div>

      <!-- Income Subcategories -->
      <div class="chart-container">
        <h3>Income Breakdown</h3>
        <Chart type="pie" :data="incomeChartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Chart from "primevue/chart";
import StatsCard from "@/components/categories/StatsCard.vue"; // <-- import your reusable card
import { useTransactionStore } from '@/stores/transactionStore';
import AddCategoryForm from "@/components/categories/AddCategoryForm.vue";

const handleAddCategory = (category: Category) => {
  categories.value.push(category);
};



export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "Income" | "Expense";
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
  total?: number;
}

const transactionStore = useTransactionStore();

// Example categories
const categories = ref<Category[]>([
  { id: "1", user_id: "u1", name: "Utilities", type: "Expense", created_at: "2025-11-22", total: 200 },
  { id: "2", user_id: "u1", name: "Transportation", type: "Expense", created_at: "2025-11-22", total: 150 },
  { id: "3", user_id: "u1", name: "Food & Groceries", type: "Expense", created_at: "2025-11-22", total: 300 },
  { id: "4", user_id: "u1", name: "Tuition", type: "Expense", created_at: "2025-11-22", total: 500 },
  { id: "5", user_id: "u1", name: "Salary", type: "Income", created_at: "2025-11-22", total: 2000 },
  { id: "6", user_id: "u1", name: "Sales", type: "Income", created_at: "2025-11-22", total: 800 },
]);

// Totals
const totalExpenses = computed(() =>
  categories.value.filter(c => c.type === "Expense").reduce((sum, c) => sum + (c.total || 0), 0)
);

const totalIncome = computed(() =>
  categories.value.filter(c => c.type === "Income").reduce((sum, c) => sum + (c.total || 0), 0)
);

// Currency formatter
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

// Chart Data
const incomeVsExpenseData = computed(() => ({
  labels: ["Expenses", "Income"],
  datasets: [
    {
      data: [totalExpenses.value, totalIncome.value],
      backgroundColor: ["#f87171", "#34d399"],
    },
  ],
}));

const expenseChartData = computed(() => ({
  labels: categories.value.filter(c => c.type === "Expense").map(c => c.name),
  datasets: [
    {
      data: categories.value.filter(c => c.type === "Expense").map(c => c.total || 0),
      backgroundColor: ["#f87171", "#fbbf24", "#60a5fa", "#a78bfa", "#f472b6"],
    },
  ],
}));

const incomeChartData = computed(() => ({
  labels: categories.value.filter(c => c.type === "Income").map(c => c.name),
  datasets: [
    {
      data: categories.value.filter(c => c.type === "Income").map(c => c.total || 0),
      backgroundColor: ["#34d399", "#10b981", "#22d3ee", "#fde68a"],
    },
  ],
}));

// Chart Options (legend text visible)
const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: "#000", // black text for visibility
      },
    },
  },
};
</script>

<style scoped>
.categories-page {
  padding: 2rem;
  color: var(--surface-0);
}

.totals-blocks {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 10px;
}

.chart-container {
  flex: 1 1 300px;
  max-width: 400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
</style>