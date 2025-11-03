import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Account from '@/views/Account.vue'
import Transactions from '@/views/Transactions.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/',
      name: 'Transactions',
      component: Transactions
    }
    , 
  ]
})

export default router