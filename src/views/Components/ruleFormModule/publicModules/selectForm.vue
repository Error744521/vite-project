<template>
  <el-select
    :model-value="modelValue"
    :placeholder="field.placeholder || `请选择${field.label || ''}`"
    :multiple="isMultiple"
    :filterable="field.filterable"
    :disabled="field.disabled"
    :loading="loading"
    clearable
    @change="handleChange"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number, Array], default: '' },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const isMultiple = computed(() => props.field.multiple || props.field.type === 'Array')

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>
