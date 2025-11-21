import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue')
    }
  ]
})


import { useAuthStore } from '@/stores/authStore'

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if the route requires auth
  if (to.meta.requiresAuth && !authStore.user) {
    // If not logged in, redirect to Login
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router