import { createRouter, createWebHistory } from 'vue-router'
import common from '@/router/common.js'

const index = import.meta.env.VITE_INDEX_URL
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/A_basicsPages/login.vue')
  },
  {
    path: '/seedSystem',
    name: 'seedSystem',
    component: () => import('@/pages/A_basicsPages/seedSystem.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/pages/A_basicsPages/index.vue'),
    redirect: index,
    children: common
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/pages/A_basicsPages/500.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
