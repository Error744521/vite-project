<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key" :label-width="field.labelWidth" >
    <el-select
      :model-value="modelValue"
      :placeholder="fieldPlaceholder(field)"
      collapse-tags
      collapse-tags-tooltip
      clearable
      :loading="loading"
      :multiple="isMultipleField(field)"
      @update:model-value="changeSelect"
    >
      <el-option label="全部" value="" />
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>
</template>

<script setup>
import { isNotEmpty } from '@/utils/tools.js'
import { fieldLabel, fieldPlaceholder, isMultipleField } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array],
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
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const emitValue = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const changeSelect = (param) => {
  if (Array.isArray(param)) {
    const previousValue = Array.isArray(props.modelValue) ? props.modelValue : []
    const previousHasAll = previousValue.includes('')
    const nextHasAll = param.includes('')

    if (!isNotEmpty(param)) {
      emitValue([])
      return
    }
    if (nextHasAll && !previousHasAll) {
      emitValue([''])
      return
    }
    if (nextHasAll && previousHasAll) {
      emitValue(param.filter((item) => item !== ''))
      return
    }
    emitValue(param)
    return
  }

  if (!isNotEmpty(param)) {
    emitValue('')
    return
  }
  emitValue(param)
}
</script>

<style scoped lang="scss">

</style>
