import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Auth from '../views/Auth.vue'
import Dashboard from '../views/Dashboard.vue'
import AIAssistant from '../views/AIAssistant.vue'
import WarehouseMap from '../views/WarehouseMap.vue'
import History from '../views/History.vue'
import Settings from '../views/Settings.vue'
import Profile from '../views/Profile.vue'
import { supabase } from '../lib/supabase'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: Auth
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: Auth
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: AIAssistant,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'WarehouseMap',
    component: WarehouseMap,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Authentication Guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session
  
  // Check if we are in a password recovery flow
  const isRecovery = 
    window.location.href.includes('type=recovery') || 
    to.hash.includes('type=recovery') || 
    to.query.type === 'recovery' ||
    to.query.recovery === 'true' ||
    window.location.hash.includes('type=recovery')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If route requires auth and user is not logged in, redirect to login
    next('/login')
  } else if (to.path === '/' && isRecovery) {
    // If user lands on root with a recovery token, send them to login
    next('/login?recovery=true')
  } else if ((to.path === '/login' || to.path === '/signup') && isAuthenticated && !isRecovery) {
    // If user is already logged in and tries to go to login/signup, redirect to dashboard
    // BUT allow them to stay if it's a password recovery session
    next('/dashboard')
  } else {
    next()
  }
})

export default router
