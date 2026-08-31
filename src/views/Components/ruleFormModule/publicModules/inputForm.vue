<template>
  <div class="input-form">
    <div v-if="field.title || field.description" class="input-title">
      <span v-if="field.title" class="title-text">{{ field.title }}</span>
      <span v-if="field.description" class="title-desc">{{ field.description }}</span>
    </div>
    <el-input
      :style="{ width: field.width || '100%' }"
      :model-value="modelValue"
      :type="field.type || 'text'"
      :placeholder="field.placeholder || `请输入${field.label || field.title || ''}`"
      :disabled="field.disabled"
      :maxlength="field.maxlength"
      clearable
      @input="handleInput"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.input-form {
  width: 100%;
}

.input-title {
  margin-bottom: 10px;
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
</style>
