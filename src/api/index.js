import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/store/system.js'
import request from '@/utils/request.js'
import router from '@/router/index.js'

// API 请求缓存
const requestCache = new Map()

export async function submitItem (url, type, param = {}, options = {}) {
  const method = type || 'get'
  const data = cleanParams(param)
  const cacheKey = generateCacheKey(url, method, data)
  if (requestCache.has(cacheKey)) {
    return Promise.resolve(requestCache.get(cacheKey))
  }
  const response = await request({
    url,
    method,
    params: method === 'get' ? data : undefined,
    data: method === 'get' ? undefined : data
  })
  const result = handleBusinessCode(response, { url, options })
  if (isSuccessCode(result?.code)) {
    requestCache.set(cacheKey, result)
  }
  return result
}

const messageQueue = []
let messageTimer = null
const CODE_STATE = {
  200: { message: '请求成功', level: 0, success: true },
  201: { message: '创建成功', level: 0, success: true },
  204: { message: '操作成功', level: 0, success: true },
  301: { message: '域名更换了', level: 30 },
  302: { message: '域名临时转移', level: 30 },
  304: { message: '缓存有效', level: 10 },
  400: { message: '请求格式不对', level: 40 },
  401: { message: '没登录', level: 100, route: '/login', clearUserInfo: true },
  403: { message: '没权限', level: 90, route: '/error/403' },
  404: { message: '地址不存在', level: 60, route: '/error/404' },
  405: { message: '请求方法不支持', level: 40 },
  422: { message: '请求参数错误', level: 40 },
  429: { message: '请求太频繁', level: 40 },
  500: { message: '服务器内部错误（代码异常/数据库崩）', level: 80, route: '/500' },
  502: { message: '网关坏了', level: 80, route: '/500' },
  503: { message: '服务器忙/维护中（服务停了/卡死）', level: 80, route: '/500' },
  504: { message: '网关超时', level: 80, route: '/500' }
}
function handleBusinessCode(res = {}, context = {}) {
  const code = Number(res?.code)
  const state = CODE_STATE[code] || {}
  const message = res?.msg || res?.message || state.message || '请求失败'
  const silent = context.options?.silent
  const item = {
    code,
    message,
    url: context.url,
    route: state.route || (!CODE_STATE[code] && code ? `/error/${code}` : ''),
    clearUserInfo: state.clearUserInfo,
    response: res
  }

  if (isSuccessCode(code)) {
    if (context.options?.showSuccess && !silent) {
      pushApiMessage({
        ...item,
        type: 'success',
        message: context.options?.successMessage || message
      })
    }
    return res
  }

  if (!silent) pushApiMessage({ ...item, type: 'error' })
  return res
}

function pushApiMessage(item) {
  messageQueue.push(item)

  if (messageTimer) return
  messageTimer = setTimeout(flushApiMessage, 300)
}

function flushApiMessage() {
  const list = messageQueue.splice(0)
  messageTimer = null
  if (list.length === 0) return

  const errors = list.filter((item) => item.type === 'error')
  if (errors.length === 0) {
    ElMessage.success(list[0]?.message || '请求成功')
    return
  }

  console.error('[API Error List]', errors.map((item) => ({
    code: item.code,
    message: item.message,
    url: item.url,
    response: item.response
  })))

  const target = getMostSeriousError(errors)
  if (target.clearUserInfo) {
    useSystemStore().clearInfo()
  }

  ElMessage.error(target.message)
  if (target.route) {
    router.push({ path: target.route })
  }
}

function getMostSeriousError(errors) {
  return [...errors].sort((a, b) => getStatusLevel(b.code) - getStatusLevel(a.code))[0]
}

function getStatusLevel(code) {
  if (CODE_STATE[code]?.level !== undefined) return CODE_STATE[code].level
  if (code >= 500) return 80
  if (code >= 400) return 40
  return 10
}

function isSuccessCode(code) {
  return CODE_STATE[Number(code)]?.success === true
}

// 生成缓存键
function generateCacheKey(url, type, param) {
  const paramStr = JSON.stringify(param)
  return `${url}_${type}_${paramStr}`
}


/**
 * param  递归过滤对象和数组中的空值
 *
 * return param参数对象
 */
function cleanParams(value) {
  if (value === '' || value === null || value === undefined) return undefined

  if (Array.isArray(value)) {
    return value.map(item => cleanParams(item)).filter(item => item !== undefined)
  }
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return Object.keys(value).reduce((result, key) => {
      const item = cleanParams(value[key])
      if (item !== undefined) {
        result[key] = item
      }
      return result
    }, {})
  }
  return value
}
