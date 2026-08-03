<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key" class="class-group-select">
    <el-select v-model="leftValue" :placeholder="field.label" class="left-select" @change="emitValue">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select
      v-model="rightValue"
      :placeholder="fieldPlaceholder(field)"
      class="right-select"
      :multiple="isMultipleField(field)"
      filterable
      collapse-tags
      collapse-tags-tooltip
      clearable
      @change="emitValue"
    >
      <el-option v-for="item in childOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { fieldLabel, fieldPlaceholder, isMultipleField } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [Object, Array, String],
    default: () => ({})
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
const leftValue = ref('')
const rightValue = ref(isMultipleField(props.field) ? [] : '')
const childOptions = computed(() => props.field.childOptions || [])

const syncValue = (value) => {
  const [leftKey, rightKey] = props.field.modelKeys || []
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    leftValue.value = value[leftKey] || ''
    rightValue.value = value[rightKey] || (isMultipleField(props.field) ? [] : '')
    return
  }
  leftValue.value = ''
  rightValue.value = isMultipleField(props.field) ? [] : ''
}

watch(() => props.modelValue, syncValue, { immediate: true, deep: true })

const emitValue = () => {
  const [leftKey, rightKey] = props.field.modelKeys || []
  if (!leftValue.value || (Array.isArray(rightValue.value) ? rightValue.value.length === 0 : !rightValue.value)) {
    emit('update:modelValue', null)
    emit('change', null)
    return
  }

  const value = {
    [leftKey]: leftValue.value,
    [rightKey]: rightValue.value
  }
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.class-group-select {
  display: inline-block;
  padding-right: 2px;
  :deep(.right-select) {
    margin-right: 1px;
  }
}
</style>
