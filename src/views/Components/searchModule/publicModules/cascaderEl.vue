<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key">
    <el-cascader
      class="search-form-cascader"
      :model-value="modelValue"
      :options="options"
      :props="cascaderProps"
      :placeholder="fieldPlaceholder(field)"
      :show-all-levels="!isMultipleField(field)"
      filterable
      collapse-tags
      clearable
      show-checked-strategy="child"
      @update:model-value="handleChange"
      @clear="handleClear"
    />
  </el-form-item>
</template>

<script setup>
import { computed } from 'vue'
import { fieldLabel, fieldPlaceholder, isMultipleField } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
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
const cascaderProps = computed(() => ({
  showPrefix: true,
  multiple: isMultipleField(props.field),
  emitPath: !isMultipleField(props.field),
  checkStrictly: props.field.type === 'String'
}))

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleClear = () => {
  const value = isMultipleField(props.field) ? [] : ''
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.search-form-cascader {
  width: 220px;
}
:deep(.search-form-cascader .el-cascader__tags) {
  flex-wrap: nowrap;
  max-width: calc(100% - 34px);
  z-index: 1;
  pointer-events: none;
}
:deep(.search-form-cascader .el-cascader__tags .el-tag) {
  pointer-events: auto;
}
:deep(.search-form-cascader .el-cascader__tags .el-tag__close) {
  pointer-events: auto;
}
:deep(.search-form-cascader .el-input__suffix) {
  z-index: 3;
}
:deep(.search-form-cascader .el-input__suffix-inner) {
  z-index: 4;
}
:deep(.el-cascader-node__prefix) {
  position: absolute !important;
}
</style>
