<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key">
    <el-cascader
      :model-value="modelValue"
      :options="options"
      :props="cascaderProps"
      :placeholder="fieldPlaceholder(field)"
      :filterable="false"
      clearable
      collapse-tags
      @update:model-value="handleChange"
    />
  </el-form-item>
</template>

<script setup>
import { computed } from 'vue'
import { fieldLabel, fieldPlaceholder } from './fieldProps.js'

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
  },
  loadOptions: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const cascaderProps = computed(() => ({
  multiple: false,
  checkStrictly: true,
  emitPath: false,
  showPrefix: false,
  checkOnClickNode: false,
  lazy: true,
  lazyLoad: async (node, resolve) => {
    try {
      const requestKey = props.field.request?.key
      const extraParam = requestKey && node.value !== undefined ? { [requestKey]: node.value } : {}
      const list = props.loadOptions ? await props.loadOptions(props.field, extraParam) : []
      resolve(list.map((item) => ({ ...item, leaf: item.leaf !== undefined ? item.leaf : node.level >= 2 })))
    } catch {
      resolve([])
    }
  }
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
</style>
