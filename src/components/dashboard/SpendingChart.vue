<script setup>
import { computed, ref, onMounted } from 'vue';
import { useBudgetStore } from '@/stores/budgetStore';
import Chart from 'primevue/chart';

const budgetStore = useBudgetStore();

onMounted(() => {
  budgetStore.fetchBudgets();
});

const chartData = computed(() => {
  const budgets = budgetStore.budgets || [];
  
 
  const activeBudgets = budgets.filter(b => b.spent > 0);

  return {
    
    labels: activeBudgets.map(b => b.categories?.name || b.name || 'Uncategorized'),
    datasets: [
      {
        data: activeBudgets.map(b => b.spent),
      
        backgroundColor: activeBudgets.map((b, index) => 
            b.categories?.color || ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#a855f7"][index % 5]
        ),
        hoverOffset: 4
      }
    ]
  };
});

const chartOptions = ref({
  plugins: {
    legend: { position: 'right' }
  }
});

const hasData = computed(() => {
    return budgetStore.budgets && budgetStore.budgets.some(b => b.spent > 0);
});
</script>

<template>
  <div class="chart-container">
    <h3>Spending by Budget</h3>
    
    <div v-if="hasData" class="chart-wrapper">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full h-20rem" />
    </div>

    <div v-else class="no-data">
        <p v-if="budgetStore.isLoading">Loading...</p>
        <p v-else>No spending data available yet.</p>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
}
.chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}
.no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #9ca3af;
}
</style>