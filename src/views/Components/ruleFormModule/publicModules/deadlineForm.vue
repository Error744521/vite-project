<template>
  <div class="deadline-form">
    <el-button class="deadline-button" :disabled="checked || field.disabled" @click="changeValue(-1)">-</el-button>
    <el-input
      :model-value="inputValue"
      :disabled="checked || field.disabled"
      class="deadline-input"
      @input="handleInput"
      @blur="normalizeValue"
    />
    <el-button class="deadline-button" :disabled="checked || field.disabled" @click="changeValue(1)">+</el-button>
    <span class="deadline-unit">{{ field.unit || '天' }}</span>
    <el-checkbox :model-value="checked" :disabled="field.disabled" @change="handleCheckedChange">
      {{ field.checkboxLabel || '不设置完成期限' }}
    </el-checkbox>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const defaultValue = computed(() => Number(props.field.defaultValue ?? 15))
const checkedValue = computed(() => Number(props.field.checkedValue ?? 0))
const minValue = computed(() => Number(props.field.min ?? 1))
const checked = computed(() => Number(props.modelValue) === checkedValue.value)
const inputValue = computed(() => props.modelValue)

const normalizeNumber = (value) => {
  const number = Number(value)
  return Number.isInteger(number) && number >= minValue.value ? number : defaultValue.value
}

const changeValue = (step) => {
  const value = normalizeNumber(props.modelValue)
  emit('update:modelValue', Math.max(minValue.value, value + step))
}

const handleInput = (value) => {
  emit('update:modelValue', value)
}

const normalizeValue = () => {
  if (checked.value) return
  emit('update:modelValue', normalizeNumber(props.modelValue))
}

const handleCheckedChange = (value) => {
  emit('update:modelValue', value ? checkedValue.value : defaultValue.value)
}
</script>

<style scoped lang="scss">
.deadline-form {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.deadline-button {
  width: 34px;
  height: 34px;
  padding: 0;
  font-size: 20px;
  line-height: 1;
}

.deadline-input {
  width: 100px;
}

.deadline-unit {
  color: var(--el-text-color-regular);
}
</style>
