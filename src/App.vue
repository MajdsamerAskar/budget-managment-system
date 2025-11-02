<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/Account.vue">Account</router-link>
        <router-link to="/Transactions.vue">Transactions</router-link>
        
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <footer>
      <!-- Your footer content -->
    </footer>
  </div>
  <SpinnerLoading/>
  <ErrorMessage :message="'Account is not accessible'" />
</template>

<script setup lang="ts">
import ErrorMessage from './components/ErrorMessage.vue';
import SpinnerLoading from './components/SpinnerLoading.vue';

// Component logic here
</script>

<style scoped>
/* Your styles */
</style>