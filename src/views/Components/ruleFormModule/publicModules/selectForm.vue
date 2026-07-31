<template>
  <el-select :model-value="modelValue" :placeholder="'请选择' + attributes.label" :multiple="attributes.multiple" :filterable="attributes.filterable" @change="handleChange">
    <el-option v-for="(item, index) in state.list" :key="index" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { submitItem } from '@/api/index.js'

const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const state = ref({
  list: [],
  multiple: props.attributes.multiple || false,
  filterable: props.attributes.filterable || false
})

const fetchData = async () => {
  const { request, list } = props.attributes
  if (list && list.length > 0) {
    state.value.list = list
    return
  }

  try {
    const { url, method = 'get', param = {}, label = 'label', value = 'value' } = request
    const response = await submitItem(url, method, param)
    if (response.code === 200) {
      const data = response.data || response
      state.value.list = data.map(item => ({
        label: item[label],
        value: item[value]
      }))
    } else {
      console.warn('API request failed:', response.message)
    }
  } catch (error) {
    console.error('Fetch error:', error)
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
</style>
