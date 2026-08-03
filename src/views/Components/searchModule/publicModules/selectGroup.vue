<template>
  <el-form-item :label="state.label" :prop="attributes.key" class="class-group-select">
    <el-select v-model="key" :placeholder="attributes.label" class="left-select" @change="handleSelect">
      <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="value" :placeholder="state.placeholder" class="right-select" @change="changeSelect"
               :multiple="state.multiple" :filterable="true" collapse-tags collapse-tags-tooltip clearable>
      <el-option v-for="(item, index) in childlist" :key="index" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
import { isNotEmpty } from '@/utils/tools.js'
import {submitItem} from "@/api/index.js";
const store = useFormStore()
const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  },
})
const key = ref('')
const value = ref(null)
const list = ref([])
const childlist = ref([])

const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  labelWidth: props.attributes.labelWidth,
  placeholder: '请选择' + props.attributes.label,
  multiple: false,
  sublable: '',
  childlable: '',
})
state.value.multiple = props.attributes.type === "Array" ? true : false
const emit = defineEmits(['changeFn']);

const handleSelect = (param) => {
  if (isNotEmpty(param)) {
    const index = list.value.findIndex(item => item.value === param)
    state.value.sublable = list.value[index].label
    if (isNotEmpty(value.value)) {
      setStore()
    }
  }
}

const changeSelect = (data) => {
  if (isNotEmpty(data)) {
    let param = data
    if (data instanceof String) {
      param = [data]
    }
    if (data !== undefined && data !== ''){
      const array = childlist.value.filter(item => param.indexOf(item.value) !== -1)
      state.value.childlable = array.map(item => item.label).join("、");
    }
    if (isNotEmpty(key.value)){
      setStore()
    }
  } else {
    store.setSearchFormRecord({ name: props.attributes.label, value: '', key: props.attributes.key })
    const formData = { [props.attributes.keys[0]]: null, [props.attributes.keys[1]]: null }
    store.setSearchRuleForm(formData)
  }
}

const setStore = () => {
  const name = state.value.sublable + ':' + state.value.childlable
  store.setSearchFormRecord({ name: props.attributes.label, value: name, key: props.attributes.key })
  const formData = { [props.attributes.keys[0]]: key.value, [props.attributes.keys[1]]: value.value }
  store.setSearchRuleForm(formData)
}

const fetchData = async() => {
  const {request, list, childlist} = props.attributes
  if (list && list.length > 0) {
    list.value = list
    return
  }
  if (childlist && childlist.length > 0) {
    childlist.value = childlist
    return
  }
  try {
    if (list && list.length <= 0) {
      const {url, method = 'get', param = {}, label = 'label', value = 'value'} = request[0]
      const response = await submitItem(url, method, param)
      if (response.code === 200) {
        const data = response.data || response
        list.value = data.map(item => ({
          label: item[label],
          value: item[value]
        }))
      }
    }
    if (childlist && childlist.length <= 0) {
      const index = list && list.length > 0 ? 0 : 1
      const {url, method = 'get', param = {}, label = 'label', value = 'value'} = request[index]
      const response = await submitItem(url, method, param)
      if (response.code === 200) {
        const data = response.data || response
        childlist.value = data.map(item => ({
          label: item[label],
          value: item[value]
        }))
      }
    }
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

watch(() => [store.searchRuleForm[props.attributes.keys[0]], store.searchRuleForm[props.attributes.keys[1]]], (newVal, oldVal) => { //searchRuleForm
  if (newVal[0] === undefined && newVal[1] === undefined) {
    key.value = ''
    value.value = props.attributes.type === 'Array' ? [] : ''
  }
})

onMounted(() => {
  if (props.attributes && props.attributes.value) {
    value.value = props.attributes.type === 'Array' ? [] : ''
    value.value = props.attributes.value
  }
  fetchData()

/*  list.value = props.attributes.list
  childlist.value = props.attributes.childlist*/
})

</script>
<style scoped lang="scss">
.class-group-select{
  display: inline-block;
  padding-right: 2px;
  :deep(.right-select) {
    margin-right: 1px;
  }
}
</style>
