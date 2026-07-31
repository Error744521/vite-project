import router from './index.js'
import { useSystemStore } from '@/store/system.js'

router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (['login', 'loginRole'].includes(to.name)) {
    next()
  } else {
    const store = useSystemStore()
    const token = store.getToken || ''
    if (token) {
      try {
        next()
      } catch (e) {
        next('/login')
      }
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
})
