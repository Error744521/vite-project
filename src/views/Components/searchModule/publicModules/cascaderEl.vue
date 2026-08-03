<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key">
    <el-cascader
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
</script>

<style scoped lang="scss">
.search-form-cascader {
  .el-cascader-node__prefix {
    position: absolute !important;
  }
}
:deep(.el-cascader__tags) {
  flex-wrap: nowrap;
}
:deep(.cascader__tags) {
  width: initial;
}
</style>
