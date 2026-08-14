<template>
  <el-input
    :model-value="modelValue"
    type="textarea"
    :placeholder="field.placeholder || `请输入${field.label || ''}`"
    :rows="field.rows || 3"
    :disabled="field.disabled"
    :maxlength="field.maxlength"
    clearable
    @input="handleInput"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>
