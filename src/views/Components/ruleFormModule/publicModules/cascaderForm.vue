<template>
  <el-cascader style="width: 50%"
    :model-value="modelValue"
    :options="state.list"
    :placeholder="'请选择' + attributes.label"
    :multiple="attributes.multiple || false"
    :check-strictly="attributes.checkStrictly || false"
    :show-all-levels="attributes.showAllLevels !== false"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, String], default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const state = ref({
  list: []
})

const fetchData = async () => {
  state.value.list = [
    {
      label: '一级选项',
      value: '1',
      children: [
        {
          label: '二级选项1',
          value: '1-1',
          children: [
            { label: '三级选项1', value: '1-1-1' },
            { label: '三级选项2', value: '1-1-2' }
          ]
        },
        {
          label: '二级选项2',
          value: '1-2',
          children: [
            { label: '三级选项3', value: '1-2-1' },
            { label: '三级选项4', value: '1-2-2' }
          ]
        }
      ]
    }
  ]
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
