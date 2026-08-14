<template>
  <el-input
    :model-value="modelValue"
    :type="field.type || 'text'"
    :placeholder="field.placeholder || `请输入${field.label || ''}`"
    :disabled="field.disabled"
    :maxlength="field.maxlength"
    clearable
    @input="handleInput"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>
