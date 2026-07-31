<template>
  <el-radio-group v-if="attributes.type === 'radio'" :model-value="modelValue" @change="handleChange">
    <el-radio v-for="(item, index) in state.list" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-radio>
  </el-radio-group>
  <el-radio-group v-else-if="attributes.type === 'button'" :model-value="modelValue" @change="handleChange">
    <el-radio-button v-for="(item, index) in state.list" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-radio-button>
  </el-radio-group>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const state = ref({
  list: []
})

const fetchData = async () => {
  if (props.attributes.list && props.attributes.list.length > 0) {
    state.value.list = props.attributes.list
  } else {
    state.value.list = [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' }
    ]
  }
}

const handleChange = (value) => {
  emit('update:modelValue', value)
}

onMounted(() => {
  fetchData()
})

watch(() => props.attributes, () => {
  fetchData()
}, { deep: true })
</script>

<style scoped lang="scss">
.el-radio-group {
  width: 100%;
  .el-radio{
    width: 18%;
  }
  :deep(.el-radio-button__inner){
    min-width: 120px;
  }
}
</style>
