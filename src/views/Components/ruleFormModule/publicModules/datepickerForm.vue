<template>
  <el-date-picker :style="{ width: '50%' }"
    v-if="attributes.type !== 'daterange'"
    v-model="dateValue" 
    :type="attributes.type" 
    :placeholder="'请选择' + attributes.label" 
    format="YYYY-MM-DD" 
    value-format="YYYY-MM-DD"
    @change="handleChange"
  />
  <el-date-picker 
    v-else
    v-model="dateValue" 
    type="daterange" 
    range-separator="至" 
    start-placeholder="开始日期" 
    end-placeholder="结束日期"
    format="YYYY-MM-DD" 
    value-format="YYYY-MM-DD"
    @change="handleChange"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Date, Array, String], default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const dateValue = computed({
  get: () => {
    if (props.modelValue === '' || props.modelValue === null || props.modelValue === undefined) {
      return props.attributes.type === 'daterange' ? [] : ''
    }
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.el-date-editor--date{
  width: 50%;
}
</style>
