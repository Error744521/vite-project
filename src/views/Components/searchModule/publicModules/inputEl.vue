<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key" :label-width="field.labelWidth">
    <el-input
      :model-value="modelValue"
      :placeholder="fieldPlaceholder(field, '请输入')"
      :type="field.type"
      show-word-limit
      :maxlength="field.maxlength"
      @update:model-value="handleChange"
    />
  </el-form-item>
</template>

<script setup>
import { fieldLabel, fieldPlaceholder } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  field: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
</style>
