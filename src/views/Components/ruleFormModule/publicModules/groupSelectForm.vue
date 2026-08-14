<template>
  <div class="group-select">
    <el-select
      :model-value="currentValue[0]"
      :placeholder="field.placeholder || `请选择${field.label || ''}`"
      :filterable="filterable[0]"
      :disabled="field.disabled"
      :loading="loading"
      clearable
      @change="handleChange($event, 0)"
    >
      <el-option v-for="item in firstOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <span class="separator">-</span>
    <el-select
      :model-value="currentValue[1]"
      :placeholder="field.childPlaceholder || `请选择${field.label || ''}`"
      :filterable="filterable[1]"
      :disabled="field.disabled || !currentValue[0]"
      :loading="loading"
      clearable
      @change="handleChange($event, 1)"
    >
      <el-option v-for="item in secondOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => ['', ''] },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  loadOptions: { type: Function, default: null }
})
const emit = defineEmits(['update:modelValue'])

const currentValue = computed(() => {
  const value = Array.isArray(props.modelValue) ? props.modelValue : []
  return [value[0] ?? '', value[1] ?? '']
})

const filterable = computed(() => props.field.filterable || [false, false])
const firstOptions = computed(() => Array.isArray(props.options?.[0]) ? props.options[0] : props.options)
const secondOptions = computed(() => Array.isArray(props.options?.[1]) ? props.options[1] : [])

const loadChildOptions = async (value) => {
  const request = Array.isArray(props.field.request) ? props.field.request[1] : null
  if (!request || !request.url || !props.loadOptions || value === '') return
  const param = request.key ? { [request.key]: value } : {}
  await props.loadOptions(props.field, param, 1)
}

const handleChange = async (value, index) => {
  const nextValue = [...currentValue.value]
  nextValue[index] = value

  if (index === 0) {
    nextValue[1] = ''
    emit('update:modelValue', nextValue)
    await loadChildOptions(value)
    return
  }

  emit('update:modelValue', nextValue)
}

watch(() => currentValue.value[0], (value) => {
  if (value) loadChildOptions(value)
}, { immediate: true })
</script>

<style scoped lang="scss">
.group-select {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  .separator {
    color: #c0c4cc;
  }
}
:deep(.el-select__selection) {
  width: 100%;
}
</style>
