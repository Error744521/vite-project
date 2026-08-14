<template>
  <el-radio-group v-if="field.type === 'radio'" :model-value="modelValue" :disabled="field.disabled" @change="handleChange">
    <el-radio v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
  <el-radio-group v-else :model-value="modelValue" :disabled="field.disabled" @change="handleChange">
    <el-radio-button v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</el-radio-button>
  </el-radio-group>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.el-radio-group {
  width: 100%;
  .el-radio {
    width: 18%;
  }
  :deep(.el-radio-button__inner) {
    min-width: 120px;
  }
}
</style>
