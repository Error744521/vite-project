/**
 * 系统读取权限 根据.env 文件配置 生成不同路由 */
import { parseEnvArray } from '@/utils/tools.js'
const pathPermission = [
  { name: '系统管理', type: 1, files: import.meta.glob(`@/pages/A_managementSystem/**/*.vue`, { eager: false }) },
  { name: '网监系统', type: 2, files: import.meta.glob(`@/pages/B_networkSystem/**/*.vue`, { eager: false }) },
  { name: '证据系统', type: 3, files: import.meta.glob(`@/pages/C_evidenceSystem/**/*.vue`, { eager: false }) },
  { name: '直播系统', type: 4, files: import.meta.glob(`@/pages/D_liveStreamingSystem/**/*.vue`, { eager: false }) },
  { name: '广告系统', type: 5, files: import.meta.glob(`@/pages/E_advertisingSystem/**/*.vue`, { eager: false }) },
  { name: '模型系统', type: 6, files: import.meta.glob(`@/pages/F_modelSystem/**/*.vue`, { eager: false }) },
  { name: '案件系统', type: 7, files: import.meta.glob(`@/pages/G_caseSystem/**/*.vue`, { eager: false }) },
  { name: '预警系统', type: 8, files: import.meta.glob(`@/pages/H_riskWarningSystem/**/*.vue`, { eager: false }) },
  { name: '统计系统', type: 9, files: import.meta.glob(`@/pages/J_statisticsSystem/**/*.vue`, { eager: false }) },
  { name: '监测模型', type: 10, files: import.meta.glob(`@/pages/X_monitoringModelSystem/**/*.vue`, { eager: false }) },
  { name: '企服管理', type: 100, files: import.meta.glob(`@/pages/Z_enterpriseManagement/**/*.vue`, { eager: false }) },
  { name: '企业服务', type: 101, files: import.meta.glob(`@/pages/Z_enterpriseSystem/**/*.vue`, { eager: false }) }
]

const getPermission = () => {
  //获取系统权限  import.meta.env.VITE_SYSTEM_TYPE
  const permission = parseEnvArray(import.meta.env.VITE_SYSTEM_TYPE, ['all'])
  let obj = {}
  pathPermission.forEach((item) => {
    if (permission.includes('all') || permission.includes(item.type)) {
      obj = { ...obj, ...item.files }
    }
  })
  return obj
}

const getSubRouter = () => {
  //生产 router path
  const requireComponent = getPermission()
  const subRouter = Object.keys(requireComponent).map(function (key) {
    let str = key.replace(/\.vue$/, '')
    const pathObj = convertPathToCamelCase(str)
    if (!pathObj?.path) return null
    return {
      path: pathObj.path,
      name: pathObj.name,
      component: requireComponent[key],
      meta: pathObj.meta
    }
  }).filter(Boolean)
  return subRouter
}

const convertPathToCamelCase = (path) => {
  //特殊页面 参数处理
  if (!path || typeof path !== 'string') {
    return ''
  }
  const parts = path.split('/').filter((part) => part.length > 0)
  if (parts.length < 2) {
    return parts.length === 1 ? parts : ''
  }
  const lastName = parts.pop()
  let fastPart = ''
  let subName = { path: `/${lastName}`, name: lastName }
  if (['detail', 'edit', 'list', 'index'].includes(lastName) && parts.length >= 2) {
    fastPart = parts.pop()
    const lastPart = lastName.charAt(0).toUpperCase() + lastName.slice(1)
    if (lastName === 'index') {
      subName = { path: `/${fastPart}${lastPart}`, name: `${fastPart}${lastPart}` }
    } else {
      subName = { path: `/${fastPart}${lastPart}/:id?/:type?`, name: `${fastPart}${lastPart}` }
    }
  }
  subName.meta = createRouteMeta({ routeName: subName.name, lastName, fastPart })
  return subName
}

const createRouteMeta = ({ routeName, lastName, fastPart }) => {
  const meta = { requireAuth: true }
  if (['index', 'list'].includes(lastName)) {
    return {
      ...meta,
      keepAlive: true,
      pageKey: routeName
    }
  }
  if (['detail', 'edit'].includes(lastName)) {
    return {
      ...meta,
      keepAlive: false,
      parentPageKey: fastPart ? `${fastPart}Index` : ''
    }
  }
  return {
    ...meta,
    keepAlive: false
  }
}

export { getSubRouter }
