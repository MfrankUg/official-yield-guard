import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Auth from '../views/Auth.vue'
import Dashboard from '../views/Dashboard.vue'
import AIAssistant from '../views/AIAssistant.vue'
import WarehouseMap from '../views/WarehouseMap.vue'
import History from '../views/History.vue'
import Settings from '../views/Settings.vue'

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
    component: Dashboard
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: AIAssistant
  },
  {
    path: '/map',
    name: 'WarehouseMap',
    component: WarehouseMap
  },
  {
    path: '/history',
    name: 'History',
    component: History
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
