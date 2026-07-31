<template>
  <el-input :model-value="modelValue" type="textarea" :placeholder="'请输入' + attributes.label" :rows="attributes.rows || 3" @input="handleInput" />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
</style>
