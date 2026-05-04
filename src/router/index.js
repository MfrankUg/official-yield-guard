import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import AIAssistant from '../views/AIAssistant.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: AIAssistant
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
