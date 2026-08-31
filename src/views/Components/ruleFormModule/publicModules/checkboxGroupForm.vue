<template>
  <div class="checkbox-group-form">
    <div v-if="field.title || field.description" class="checkbox-title">
      <span v-if="field.title" class="title-text">{{ field.title }}</span>
      <span v-if="field.description" class="title-desc">{{ field.description }}</span>
    </div>
    <el-checkbox-group :model-value="currentValue" :disabled="field.disabled" @update:model-value="handleChange">
      <el-checkbox v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  field: { type: Object, default: () => ({}) },
  options: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const currentValue = computed(() => Array.isArray(props.modelValue) ? props.modelValue : [])

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.checkbox-group-form {
  width: 100%;
}

.checkbox-title {
  margin-bottom: 14px;
  color: var(--el-text-color-primary);
}

.title-text {
  font-size: 16px;
}

.title-desc {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}
</style>
