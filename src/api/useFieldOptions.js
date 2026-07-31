import { ref, watch } from 'vue'
import { submitItem } from '@/api/index.js'

const optionCache = new Map()

const createCacheKey = (request) => {
  return JSON.stringify({
    url: request?.url,
    method: request?.method || 'get',
    param: request?.param || {}
  })
}

export const normalizeOptions = (data, request = {}) => {
  const labelKey = request.label || 'label'
  const valueKey = request.value || 'value'
  const childrenKey = request.children || 'children'
  return (Array.isArray(data) ? data : []).map((item) => ({
    label: item[labelKey] ?? item.label ?? item.name ?? '',
    value: item[valueKey] ?? item.value ?? item.id ?? '',
    rawValue: item[valueKey] ?? item.value ?? item.id ?? '',
    raw: item,
    children: item[childrenKey] ? normalizeOptions(item[childrenKey], request) : undefined
  }))
}

export function useFieldOptions(attributesRef) {
  const loading = ref(false)
  const list = ref([])

  const loadOptions = async () => {
    const attributes = attributesRef.value || {}
    const { request } = attributes

    if (attributes.list && attributes.list.length > 0) {
      list.value = normalizeOptions(attributes.list, request || {})
      return list.value
    }

    if (!request || !request.url) {
      list.value = []
      return list.value
    }

    const cacheKey = createCacheKey(request)
    if (request.cache !== false && optionCache.has(cacheKey)) {
      list.value = optionCache.get(cacheKey)
      return list.value
    }

    loading.value = true
    try {
      const response = await submitItem(request.url, request.method || 'get', request.param || {})
      const options = normalizeOptions(response.data || [], request)
      list.value = options
      if (request.cache !== false) {
        optionCache.set(cacheKey, options)
      }
      return options
    } finally {
      loading.value = false
    }
  }

  watch(attributesRef, loadOptions, { deep: true, immediate: true })

  return {
    loading,
    list,
    loadOptions
  }
}
