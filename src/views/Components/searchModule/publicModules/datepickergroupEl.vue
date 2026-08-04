<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key" class="class-group-select">
    <el-select v-model="dateKey" :placeholder="field.label" class="left-select" @change="emitValue">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-date-picker v-if="field.type === 'date'"
      v-model="dateValue" type="date" class="right-select" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :placeholder="fieldPlaceholder(field)" @change="emitValue"/>
    <el-date-picker
      v-if="field.type === 'daterange'"
      v-model="dateValue" type="daterange" class="right-select" range-separator="至" format="YYYY-MM-DD" value-format="YYYY-MM-DD" start-placeholder="起始日期" end-placeholder="截止日期" @change="emitValue"/>
  </el-form-item>
</template>

<script setup>
import { ref, watch } from 'vue'
import { fieldLabel, fieldPlaceholder } from './fieldProps.js'

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
const dateKey = ref('')
const dateValue = ref(props.field.type === 'daterange' ? [] : '')

const syncValue = (value) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      dateKey.value = ''
    }
    dateValue.value = value
    return
  }
  dateKey.value = value?.key || ''
  dateValue.value = value?.value || (props.field.type === 'daterange' ? [] : '')
}

watch(() => props.modelValue, syncValue, { immediate: true, deep: true })

const emitValue = () => {
  const value = dateKey.value && dateValue.value ? { key: dateKey.value, value: dateValue.value } : null
  emit('update:modelValue', value)
  emit('change', value)
}

</script>

<style scoped lang="scss">
.class-group-select{
  display: inline-block;
  padding-right: 2px;
  margin-left: 1px;
}
</style>
