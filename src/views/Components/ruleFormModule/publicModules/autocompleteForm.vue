<template>
  <el-autocomplete
    :model-value="modelValue"
    :placeholder="'请输入' + attributes.label"
    :fetch-suggestions="querySearch"
    @select="handleSelect"
    @input="handleInput"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { submitItem } from "@/api/index.js";

const props = defineProps({
  modelValue: { type: String, default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const state = ref({
  list: []
})

const fetchData = async () => {
  const { request, list } = props.attributes
  if (list && list.length > 0) {
    state.value.list = list
    return
  }
  try {
    if (!request || !request.url) return
    const { url, method = 'get', param = {}, label = 'label', value = 'value' } = request
    const response = await submitItem(url, method, param)
    if (response.code === 200) {
      const data = response.data || response
      state.value.list = data.map(item => ({
        value: item[label],
        link: item[value]
      }))
      console.log(state.value.list)
    } else {
      console.warn('API request failed:', response.message)
      state.value.list = []
    }
  } catch (error) {
    console.error('Fetch error:', error)
    state.value.list = []
  }
}

const querySearch = (queryString, cb) => {
  const results = queryString
    ? state.value.list.filter(item => item.label.toLowerCase().includes(queryString.toLowerCase()))
    : state.value.list
  cb(results)
}

const handleSelect = (item) => {
  emit('update:modelValue', item.value)
}

const handleInput = (value) => {
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
