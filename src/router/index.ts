
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
// import Transactions from '@/views/TransactionsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // THIS IS THE KEY PART TO SEE YOUR WORK
      path: '/',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: false } // Optional: Mark as protected
    },
    // {
    //   path: '/transactions',
    //   name: 'Transactions',
    //   component: Transactions
    // }
  ]
})

export default router