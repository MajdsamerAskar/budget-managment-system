<script setup>
defineProps({
  title: String,
  amount: String,
  icon: String,
  color: String,
  bg: String
});
</script>

<template>
  <div class="stats-card">
    <div class="stats-info">
      <span class="title">{{ title }}</span>
      <h2 class="amount">{{ amount }}</h2>
    </div>
    <div class="icon-box" :class="[color, bg]">
      <i :class="icon"></i>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.stats-info {
  flex: 1;
}

.title { 
  font-size: 0.9rem; 
  font-weight: 500;
  display: block;
}

.amount { 
  margin: 0.5rem 0 0 0; 
  font-size: 1.5rem; 
  font-weight: 600;
}

.icon-box {
  width: 48px; 
  height: 48px;
  min-width: 48px;
  border-radius: 10px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* Color utilities */
.text-green-500 { color: #10b981; }
.bg-green-100 { background-color: #d1fae5; }
.text-emerald-500 { color: #10b981; }
.bg-emerald-100 { background-color: #d1fae5; }
.text-red-500 { color: #ef4444; }
.bg-red-100 { background-color: #fee2e2; }
.text-blue-500 { color: #3b82f6; }
.bg-blue-100 { background-color: #dbeafe; }
</style>