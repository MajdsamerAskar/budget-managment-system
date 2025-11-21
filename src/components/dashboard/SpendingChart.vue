<script setup>
import { computed, ref } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore'; // Or TransactionStore
import Chart from 'primevue/chart';

const budgetStore = useBudgetStore();

const chartData = computed(() => {
  return {
    labels: budgetStore.budgets.map(b => b.title || 'Uncategorized'),
    datasets: [
      {
        data: budgetStore.budgets.map(b => b.spent),
        backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#a855f7"],
        hoverBackgroundColor: ["#2563eb", "#dc2626", "#059669", "#d97706", "#9333ea"]
      }
    ]
  };
});

const chartOptions = ref({
  plugins: {
    legend: { position: 'right' }
  }
});
</script>

<template>
  <div class="chart-container">
    <h3>Spending by Category</h3>
    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full h-20rem" />
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>