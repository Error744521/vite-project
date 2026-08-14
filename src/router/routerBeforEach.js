import router from './index.js'
import { useSystemStore } from '@/store/system.js'

router.beforeEach((to, from, next) => {
  const store = useSystemStore()
  const token = store.getToken || ''
  const requireAuth = to.matched.some((record) => record.meta.requireAuth)

  if (to.path === '/login' && token) {
    next({ path: '/index' })
    return
  }

  if (!requireAuth) {
    next()
    return
  }

  if (!token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  next()
})
