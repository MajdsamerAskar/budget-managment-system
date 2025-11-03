import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Account from '@/views/Login.vue'
import Transactions from '@/views/Transactions.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
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