<template>
  <el-cascader
    :style="{ width: field.width || '50%' }"
    :model-value="modelValue"
    :options="options"
    :props="cascaderProps"
    :placeholder="field.placeholder || `请选择${field.label || ''}`"
    :show-all-levels="field.showAllLevels !== false"
    :disabled="field.disabled"
    clearable
    @change="handleChange"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Array, String, Number], default: '' },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const cascaderProps = computed(() => ({
  multiple: props.field.multiple || props.field.type === 'Array',
  checkStrictly: props.field.checkStrictly || false,
  emitPath: props.field.emitPath !== false
}))

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>
