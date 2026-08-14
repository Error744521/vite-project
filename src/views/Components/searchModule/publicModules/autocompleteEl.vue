<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key">
    <el-autocomplete
      :model-value="displayValue"
      :fetch-suggestions="querySearch"
      :placeholder="fieldPlaceholder(field)"
      value-key="label"
      @update:model-value="handleInput"
      @select="handleSelect"
    />
  </el-form-item>
</template>

<script setup>
import { fieldLabel, fieldPlaceholder } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  field: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const displayValue = ref('')

const findOptionByValue = (value) => {
  return props.options.find((item) => item.value === value || String(item.value) === String(value))
}

const handleInput = (value) => {
  displayValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleSelect = (item) => {
  const value = item?.value ?? item?.label ?? ''
  displayValue.value = item?.label ?? value
  emit('update:modelValue', value)
  emit('change', value)
}

const querySearch = (queryString, cb) => {
  const keyword = String(queryString || '')
  const results = keyword ? props.options.filter((item) => String(item.label).includes(keyword)) : props.options
  cb(results)
}

watch([() => props.modelValue, () => props.options], ([value]) => {
  const option = findOptionByValue(value)
  displayValue.value = option?.label ?? value ?? ''
}, { immediate: true, deep: true })
</script>

<style scoped lang="scss">
</style>
