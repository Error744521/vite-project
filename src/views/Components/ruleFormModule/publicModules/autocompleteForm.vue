<template>
  <el-autocomplete
    :model-value="modelValue"
    :placeholder="field.placeholder || `请输入${field.label || ''}`"
    :fetch-suggestions="querySearch"
    :disabled="field.disabled"
    clearable
    @select="handleSelect"
    @input="handleInput"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const suggestions = computed(() => {
  return props.options.map((item) => ({
    ...item,
    value: item.label,
    submitValue: item.rawValue ?? item.value
  }))
})

const querySearch = (queryString, callback) => {
  const keyword = String(queryString || '').toLowerCase()
  const result = keyword
    ? suggestions.value.filter((item) => String(item.value || '').toLowerCase().includes(keyword))
    : suggestions.value
  callback(result)
}

const handleSelect = (item) => {
  emit('update:modelValue', item.submitValue ?? item.value)
}

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>
