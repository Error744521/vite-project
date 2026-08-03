<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key">
    <el-date-picker
      v-if="field.type === 'date'"
      :model-value="modelValue"
      :type="field.type"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :placeholder="fieldPlaceholder(field)"
      @update:model-value="changePicker"
    />
    <el-date-picker
      v-if="field.type === 'daterange'"
      :model-value="modelValue"
      :type="field.type"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :placeholder="fieldPlaceholder(field)"
      @update:model-value="changePicker"
    />
  </el-form-item>
</template>

<script setup>
import { fieldLabel, fieldPlaceholder } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  field: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const changePicker = (param) => {
  emit('update:modelValue', param)
  emit('change', param)
}

</script>

<style scoped lang="scss">
</style>
