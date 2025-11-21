import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Dashboard
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },

    // Auth pages
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue')
    },

    // App sections (budgets, transactions, etc.)
    {
      path: '/budgets',
      name: 'Budgets',
      component: () => import('@/views/BudgetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/accounts',
      name: 'Accounts',
      component: () => import('@/views/AccountsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 🔐 Global auth guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // If user is null, try to fetch (used for page refresh)
  if (!authStore.user) {
    await authStore.fetchUser()
  }

  // If the route requires login and user not logged in -> redirect
  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
