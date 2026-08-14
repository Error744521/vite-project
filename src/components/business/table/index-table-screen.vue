<template>
  <div class="class-table-screen">
    <el-select class="select_flag" v-model="orderFlag" placeholder="排序方式" @change="handleOrderChange">
      <el-option v-for="item in orderDefault" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select class="select_flag" v-model="sortVal" placeholder="排序类型" @change="handleSortChange">
      <el-option v-for="item in sortDefault" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script setup>
import { submitItem } from '@/api/index.js'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  screenTable: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['callback', 'update:modelValue'])

const orderFlag = ref('')
const sortVal = ref('')
const orderDefault = ref([])
const sortDefault = ref([])

const getList = (config) => {
  if (Array.isArray(config?.options)) return config.options
  return []
}

const getRequestConfig = (config) => {
  if (config?.request) return config.request
  return null
}

const emitScreenChange = () => {
  const value = {
    order_flag: orderFlag.value,
    sort_val: sortVal.value
  }
  emit('update:modelValue', value)
  emit('callback', 'screen', value)
}

const handleOrderChange = async (val) => {
  orderFlag.value = val
  sortVal.value = ''

  const request = getRequestConfig(props.screenTable.select)
  if (request?.url) {
    try {
      const res = await submitItem(request.url, request.method || 'get', {
        ...(request.param || {}),
        order_flag: val
      })
      sortDefault.value = res.code === 200 ? res.data : []
    } catch {
      sortDefault.value = []
    }
  } else {
    sortDefault.value = getList(props.screenTable.select)
  }
  emitScreenChange()
}

const handleSortChange = (val) => {
  sortVal.value = val
  emitScreenChange()
}

watch(() => props.screenTable, (value) => {
  orderDefault.value = getList(value.sorting)
  sortDefault.value = getList(value.select)
}, { immediate: true, deep: true })

watch(() => props.modelValue, (value) => {
  orderFlag.value = value?.order_flag ?? ''
  sortVal.value = value?.sort_val ?? ''
}, { immediate: true, deep: true })
</script>

<style scoped lang="scss">
.class-table-screen {
  display: block;
  .select_flag {
    width: 140px;
    margin-right: 10px;
  }
}
</style>
