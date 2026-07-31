<template>
  <div class="group-select">
    <el-select :model-value="modelValue[0]" :placeholder="'请选择' + attributes.label" :filterable="state.filterable[0]" @change="handleChange($event, 0)">
      <el-option v-for="(item, index) in state.list[0]" :key="index" :label="item.label" :value="item.value" />
    </el-select>
    <span class="separator">—</span>
    <el-select :model-value="modelValue[1]" :placeholder="'请选择' + attributes.label" :filterable="state.filterable[1]" @change="handleChange($event, 1)">
      <el-option v-for="(item, index) in state.list[1]" :key="index" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { submitItem } from '@/api/index.js'

const props = defineProps({
  modelValue: { type: Array, default: () => ['', ''] },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const state = ref({
  list: [[], []],
  filterable: props.attributes.filterable || [false, false]
})

const fetchData = async (index = 0, parentValue = '') => {
  const { request, list } = props.attributes
  if (list && list.length > 0) {
    if (Array.isArray(list[0])) {
      state.value.list[0] = list[0]
      state.value.list[1] = list[1] || []
    } else {
      state.value.list[0] = list
      state.value.list[1] = []
    }
    return
  }

  try {
    const reqConfig = request[index]
    if (!reqConfig || !reqConfig.url) return

    const { url, method = 'get', param = {}, label = 'name', value = 'value', key: dependKey } = reqConfig

    const requestParam = { ...param }
    if (dependKey && parentValue !== '') {
      requestParam[dependKey] = parentValue
    }
    const response = await submitItem(url, method, requestParam)
    if (response.code === 200) {
      const data = response.data || response
      state.value.list[index] = data.map(item => ({
        label: item[label],
        value: item[value]
      }))
      if (index === 0 && request[1]) {
        state.value.list[1] = []
      }
    } else {
      console.warn('API request failed:', response.message)
      state.value.list[index] = []
    }
  } catch (error) {
    console.error('Fetch error:', error)
    state.value.list[index] = []
  }
}

const handleChange = (value, index) => {
  const newValue = [...(props.modelValue || ['', ''])]
  newValue[index] = value
  emit('update:modelValue', newValue)

  if (index === 0 && props.attributes.request && props.attributes.request[1] && value !== '') {
    newValue[index + 1] = ''
    fetchData(1, value)
  }
}

onMounted(async () => {
  await fetchData(0)
  if (props.modelValue && props.modelValue.length > 0 && props.modelValue[0]) {
    await fetchData(1, props.modelValue[0])
  }
})

watch(() => props.attributes, () => {
  fetchData(0)
}, { deep: true })
</script>

<style scoped lang="scss">
.group-select {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;

  .separator {
    color: #c0c4cc;
  }
}
:deep(.el-select__selection) {
  width: 100%;
}
</style>
