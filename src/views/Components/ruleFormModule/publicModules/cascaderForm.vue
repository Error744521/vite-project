<template>
  <el-cascader
    :style="{ width: field.width || '50%' }"
    :model-value="currentValue"
    :options="cascaderOptions"
    :props="cascaderProps"
    :placeholder="field.placeholder || `请选择${field.label || ''}`"
    :show-all-levels="field.showAllLevels !== false"
    :disabled="field.disabled"
    clearable
    @update:model-value="handleChange"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Array, String, Number], default: '' },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] },
  loadOptions: { type: Function, default: null }
})
const emit = defineEmits(['update:modelValue'])

const isMultiple = computed(() => props.field.multiple === true)
const lazyNodeCache = new Map()
const lazyNodeRequestMap = new Map()
const EMPTY_OPTIONS = []

const isEmptyValue = (value) => {
  return value === '' || value === null || value === undefined
}

const formatValue = (value) => {
  if (isMultiple.value) {
    if (isEmptyValue(value)) return []
    return Array.isArray(value) ? value : [value]
  }

  const currentValue = Array.isArray(value) ? value.at(-1) : value
  if (isEmptyValue(currentValue)) return ''
  return String(currentValue)
}

const formatOptionValue = (value) => {
  if (isMultiple.value || isEmptyValue(value)) return value
  return String(value)
}

const normalizeCascaderOptions = (list = []) => {
  return list.map((item) => ({
    ...item,
    value: formatOptionValue(item.value),
    children: Array.isArray(item.children) ? normalizeCascaderOptions(item.children) : item.children
  }))
}

const currentValue = computed(() => formatValue(props.modelValue))
const cascaderOptions = computed(() => {
  return props.field.lazy ? EMPTY_OPTIONS : normalizeCascaderOptions(props.options)
})

const getLazyParam = (node) => {
  const key = props.field.request?.key
  if (!key || node.value === undefined) return {}
  return { [key]: node.value }
}

const getLazyLeaf = (item, node) => {
  if (item.leaf !== undefined) return item.leaf
  if (item.raw?.leaf !== undefined) return item.raw.leaf
  if (item.raw?.is_leaf !== undefined) return item.raw.is_leaf
  return node.level >= (props.field.leafLevel || 2)
}

const getLazyNodeKey = (node) => {
  return `${props.field.key || ''}_${node.level || 0}_${node.value ?? 'root'}`
}

const normalizeLazyOptions = (list, node) => {
  return (Array.isArray(list) ? list : []).map((item) => ({
    ...item,
    value: formatOptionValue(item.value),
    leaf: getLazyLeaf(item, node)
  }))
}

const loadLazyOptions = async (node) => {
  const nodeKey = getLazyNodeKey(node)
  if (lazyNodeCache.has(nodeKey)) return lazyNodeCache.get(nodeKey)
  if (lazyNodeRequestMap.has(nodeKey)) return lazyNodeRequestMap.get(nodeKey)

  const request = (async () => {
    const list = props.loadOptions
      ? await props.loadOptions(props.field, getLazyParam(node), 0, { setOptions: false })
      : []
    const options = normalizeLazyOptions(list, node)
    lazyNodeCache.set(nodeKey, options)
    return options
  })()

  lazyNodeRequestMap.set(nodeKey, request)
  try {
    return await request
  } finally {
    lazyNodeRequestMap.delete(nodeKey)
  }
}

const requestSignature = computed(() => JSON.stringify(props.field.request || {}))

watch(requestSignature, () => {
  lazyNodeCache.clear()
  lazyNodeRequestMap.clear()
})

const cascaderProps = computed(() => {
  const baseProps = {
    multiple: isMultiple.value,
    checkStrictly: props.field.checkStrictly || false,
    emitPath: props.field.emitPath !== false
  }

  if (!props.field.lazy) return baseProps

  return {
    ...baseProps,
    lazy: true,
    lazyLoad: async (node, resolve) => {
      try {
        resolve(await loadLazyOptions(node))
      } catch {
        resolve([])
      }
    }
  }
})

const handleChange = (value) => {
  emit('update:modelValue', formatValue(value))
}
</script>
