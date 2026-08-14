<template>
  <el-date-picker
    v-if="field.type !== 'daterange'"
    v-model="dateValue"
    :style="{ width: field.width || '50%' }"
    :type="field.type || 'date'"
    :placeholder="field.placeholder || `请选择${field.label || ''}`"
    :disabled="field.disabled"
    :format="field.format || 'YYYY-MM-DD'"
    :value-format="field.valueFormat || 'YYYY-MM-DD'"
    clearable
  />
  <el-date-picker
    v-else
    v-model="dateValue"
    :style="{ width: field.width || '50%' }"
    type="daterange"
    :range-separator="field.rangeSeparator || '至'"
    :start-placeholder="field.startPlaceholder || '开始日期'"
    :end-placeholder="field.endPlaceholder || '结束日期'"
    :disabled="field.disabled"
    :format="field.format || 'YYYY-MM-DD'"
    :value-format="field.valueFormat || 'YYYY-MM-DD'"
    clearable
  />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Date, Array, String], default: '' },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const dateValue = computed({
  get: () => {
    if (props.modelValue === '' || props.modelValue === null || props.modelValue === undefined) {
      return props.field.type === 'daterange' ? [] : ''
    }
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
