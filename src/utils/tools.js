import { ElNotification } from 'element-plus'

export function OutputArea(type) {
  /*
  * type = level 返回等级
  * type = code 返回区域码
  * type = area 返回区域
  * type = province 返回省份
  * type = city 返回市
  * type = district 返回区/县 */
  const info = getStorage('userInfo') || {}
  const code = info.code
  const text = String(type || '').trim()
  const legacyTypes = ['level', 'code', 'area', 'province', 'city', 'district']

  // 兼容扩展：当参数是地区文本时，直接返回对应层级的 id
  if (!legacyTypes.includes(text)) {
    if (/(省|自治区|特别行政区)$/.test(text)) return info.province?.id
    if (/市$/.test(text)) return info.city?.id
    if (/(区|县)$/.test(text)) return info.county?.id
    return undefined
  }

  const normalizedCode = String(code || '').padEnd(6, '0')
  const provinceName = info.province?.name || ''
  const cityName = info.city?.name || ''
  const countyName = info.county?.name || ''
  const isProvince = normalizedCode.endsWith('0000')
  const isCity = !isProvince && normalizedCode.endsWith('00')
  const level = isProvince ? 1 : isCity ? 2 : 3

  if (isProvince) {
    return {
      level,
      code,
      area: provinceName,
      province: provinceName
    }[text]
  }

  if (isCity) {
    return {
      level,
      code,
      area: `${provinceName}${cityName}`,
      city: cityName
    }[text]
  }

  return {
    level,
    code,
    area: `${provinceName}${cityName}${countyName}`,
    district: cityName
  }[text]
}

export function getStorage(key, defaultValue = null) {
  const raw = localStorage.getItem(key)
  if (raw === null) return defaultValue
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

export function setStorage(key, val) {
  return localStorage.setItem(key, JSON.stringify(val))
}

export function removeStorage(key) {
  localStorage.removeItem(key)
}

export function getSession(key) {
  const raw = sessionStorage.getItem(key)
  if (raw === null) return defaultValue
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

export function setSession(key, val) {
  return sessionStorage.setItem(key, JSON.stringify(val))
}

export function removeSession(key) {
  sessionStorage.removeItem(key)
}

export function isNotEmpty(obj) {
  if (obj === '' || obj == null || obj === undefined) return false
  if (Array.isArray(obj)) return obj.length > 0
  if (typeof obj === 'object') return Object.keys(obj).length > 0
  return true
}
/**
 * value http/https 链接
 * return  false  value 为空  true 为 正确的url */
export function isLinks(value) {
  if (value === '') return false
  const regText = /^(http:|https:)\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
  if (regText.test(value)) {
    return true
  } else {
    return false
  }
}
/** value 复制内容   */
export function getlocation() {
  const param = window.location
  return param
}
/** value 复制内容 */
export async function copyName(value) {
  try {
    await navigator.clipboard.writeText(text)
    ElNotification({
      title: '复制成功',
      message: '内容已复制到剪贴板',
      type: 'success'
    })
  } catch (e) {
    ElNotification({
      title: '复制失败',
      message: '当前环境不支持复制，请手动复制',
      type: 'error'
    })
  }
}
/** url 跳转链接 */
export function goPage(url) {
  window.open(url)
}
/* 时间格式设置 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
/* 函数防抖 */
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
/* 时间戳版 节流 * */
export const throttle = (fn, delay = 300) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
/* 深拷贝 */
export const deepMerge = (target, source) => {
  const result = deepClone(target)
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }
  }
  return result
}

function deepClone(obj) {
  // 基础类型 / null / undefined 直接返回
  if (obj === null || typeof obj !== 'object') return obj

  // 日期
  if (obj instanceof Date) return new Date(obj)
  // 正则
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
  // 数组
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item))

  // 普通对象
  const cloneObj = {}
  Reflect.ownKeys(obj).forEach((key) => {
    cloneObj[key] = deepClone(obj[key])
  })
  return cloneObj
}

/* 是否是URL */
export const isUrl = (url) => {
  const reg = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return reg.test(url)
}
/* 除字符串中的空白字符 左 右 俩边 全部 */
export const trim = (str, type = 'both') => {
  if (!str) return ''
  switch (type) {
    case 'left':
      return str.replace(/^\s+/, '')
    case 'right':
      return str.replace(/\s+$/, '')
    case 'both':
      return str.trim()
    case 'all':
      return str.replace(/\s+/g, '')
    default:
      return str.trim()
  }
}
/* 字符串截取 */
export const subString = (str, start, end) => {
  if (!str) return ''
  return str.substring(start, end)
}

/* 系统权限 数据处理 */
export const parseEnvArray = (val, fallback = ['all']) => {
  if (!val) return fallback
  const trimmed = String(val).trim()
  if (trimmed === 'all' || trimmed === '[all]') return ['all']
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      return parsed.includes('all') ? ['all'] : parsed
    }
  } catch {
    /* fall through */
  }
  return trimmed
    .split(',')
    .map((s) => {
      const n = Number(s.trim().replace(/[\[\]]/g, ''))
      return Number.isNaN(n) ? s.trim() : n
    })
    .filter((v) => v !== '' && v !== undefined)
}
