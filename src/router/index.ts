import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
   
    {
      path: '/',
      name: 'Login',
      component: Login
    }
   
  ]
})

export default router