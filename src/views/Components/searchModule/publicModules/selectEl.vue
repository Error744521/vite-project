<template>
  <el-form-item :label="state.label" :prop="attributes.key" :label-width="state.labelWidth" >
    <el-select v-model="value" :placeholder="state.placeholder" collapse-tags collapse-tags-tooltip clearable
               @change="changeSelect" :multiple="state.multiple" @focus="fetchData">
      <el-option label="全部" value="" />
      <el-option v-for="(item, index) in listSelect" :key="index" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
import {submitItem} from "@/api/index.js";
const store = useFormStore()

const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  },
})
const value = ref(null)
const listSelect = ref([])
const emit = defineEmits(['changeFn']);

const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  labelWidth: props.attributes.labelWidth,
  multiple: props.attributes.type === 'Array' ? true : false,
  placeholder: '请选择' + props.attributes.label,
})


const changeSelect = (param) => {
  let name = ''
  let verification = false
  if (Array.isArray(param)) {
    verification = param.indexOf("") !== -1
  }
  if (param === "" || verification || param === undefined || param === []) {
    name = verification ? '全部' : ''
    value.value = verification ? [''] : ''
  } else {
    if (Array.isArray(param)) {
      const array = listSelect.value.filter(item => param.indexOf(item.value) !== -1)
      name = array.map(item => item.label).join("、");
    } else {
      const item = listSelect.value.find(item => item.value === param)
      name = item.label || ''
    }
  }
  store.setSearchFormRecord({ name: props.attributes.label, value: name, key: props.attributes.key })
  store.setSearchRuleForm(value.value, props.attributes.key)
}

watch(() => store.searchRuleForm[props.attributes.key], (newVal, oldVal) => {
  if (newVal === undefined) {
    value.value = null
  }
})

const fetchData = async() => {
  const { request, list } = props.attributes
  if (list && list.length > 0) {
    listSelect.value = list
    return
  }
  try {
    if (!request || !request.url || !listSelect.value) return
    const { url, method = 'get', param = {}, label = 'label', value = 'value' } = request
    const response = await submitItem(url, method, param)
    if (response.code === 200) {
      const data = response.data || response
      listSelect.value = data.map(item => ({
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
onMounted(() => {
  if (props.attributes && props.attributes.value) {
    value.value = props.attributes.value
    fetchData()
  }
})

</script>

<style scoped lang="scss">

</style>
