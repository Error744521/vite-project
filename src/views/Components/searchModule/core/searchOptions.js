import { submitItem } from '@/api/index.js'

const optionCache = new Map()
const pendingCache = new Map()
const failedCache = new Map()
const FAILED_CACHE_TTL = 30 * 1000

export const normalizeOptions = (data = [], request = {}) => {
  const labelKey = request.label || 'label'
  const valueKey = request.value || 'value'
  const childrenKey = request.children || 'children'

  return (Array.isArray(data) ? data : []).map((item) => ({
    ...item,
    label: item[labelKey] ?? item.label ?? item.name ?? '',
    value: item[valueKey] ?? item.value ?? item.id ?? '',
    children: item[childrenKey] ? normalizeOptions(item[childrenKey], request) : undefined
  }))
}

export const createOptionsCacheKey = (request = {}) => {
  return JSON.stringify({
    url: request.url,
    method: request.method || 'get',
    param: request.param || {}
  })
}

export const loadFieldOptions = async (field = {}, extraParam = {}) => {
  if (field.options && field.options.length > 0) return field.options

  const request = Array.isArray(field.request) ? field.request[0] : field.request
  if (!request || !request.url) return []

  const cacheKey = createOptionsCacheKey({ ...request, param: { ...(request.param || {}), ...extraParam } })
  if (request.cache !== false && optionCache.has(cacheKey)) {
    return optionCache.get(cacheKey)
  }
  if (request.cache !== false && pendingCache.has(cacheKey)) {
    return pendingCache.get(cacheKey)
  }
  if (request.cache !== false && failedCache.has(cacheKey)) {
    const failedAt = failedCache.get(cacheKey)
    if (Date.now() - failedAt < FAILED_CACHE_TTL) return []
    failedCache.delete(cacheKey)
  }

  const promise = submitItem(request.url, request.method || 'get', { ...(request.param || {}), ...extraParam })
    .then((response) => {
      const options = normalizeOptions(response?.data || [], request)
      if (request.cache !== false) {
        optionCache.set(cacheKey, options)
        failedCache.delete(cacheKey)
      }
      return options
    })
    .catch(() => {
      if (request.cache !== false) {
        failedCache.set(cacheKey, Date.now())
      }
      return []
    })
    .finally(() => {
      pendingCache.delete(cacheKey)
    })

  if (request.cache !== false) {
    pendingCache.set(cacheKey, promise)
  }
  return promise
}
