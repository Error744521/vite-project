import { getSubRouter } from './Permission.js'

const router = [
  {
    path: '/index',
    name: 'pageExample',
    component: () => import('@/pages/A_basicsPages/pageExample.vue'),
    meta: { keepAlive: true, requireAuth: true, pageKey: 'pageExampleIndex', name: '样例' }
  },
  {
    path: '/registrationFormDom',
    name: 'registrationFormDom',
    component: () => import('@/pages/A_basicsPages/registrationFormDom.vue'),
    meta: { keepAlive: true, requireAuth: true, name: '样例' }
  },
  {
    path: '/serchFormDom',
    name: 'serchFormDom',
    component: () => import('@/pages/A_basicsPages/serchFormDom.vue'),
    meta: { keepAlive: true, requireAuth: true, name: '样例' }
  },
  {
    path: '/iconfont',
    name: 'iconfont',
    component: () => import('@/pages/A_basicsPages/iconfont.vue'),
    meta: { keepAlive: true, requireAuth: true, name: 'iconfont' }
  },
  {
    path: '/error/:id',
    name: 'error',
    component: () => import('@/pages/A_basicsPages/error.vue'),
    meta: { keepAlive: true, requireAuth: true, name: 'error' }
  }
]
const addRoute = () => {
  const subRouter = getSubRouter()
  const array = [...subRouter, ...router]
  return array
}
const routers = addRoute()

export default routers
