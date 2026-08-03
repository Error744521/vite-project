<template>
  <el-form-item :label="state.label" :prop="attributes.key">
    <el-autocomplete v-model="value" :fetch-suggestions="querySearch" :placeholder="state.placeholder" :value-key="'label'"
         @select="handleSelect" @change="handleChange" @focus="fetchData">
    </el-autocomplete>
  </el-form-item>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
import { useMultipleStore } from "@/store/selectionMultiple.js";
import {submitItem} from "@/api/index.js";
const store = useFormStore()
const Multiple = useMultipleStore()
const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  },
})
const value = ref(null)
const listSelect = ref([])

const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: '请选择' + props.attributes.label
})

const emit = defineEmits(['changeFn']);

const handleSelect = (param) => {
  store.setSearchFormRecord({ name: props.attributes.label, value: param.label, key: props.attributes.key })
  store.setSearchRuleForm(value.value, props.attributes.key)
}
const handleChange = (value) => {
  if (props.attributes.select || value === '') {
    handleSelect({ value: value, label: value })
  }
}

const querySearch = (queryString, cb) => {
  const results = queryString ? listSelect.value.filter(item => item.label.indexOf(queryString) === 1 ) : listSelect.value
  cb(results)
}

watch(() => store.searchRuleForm[props.attributes.key], (newVal, oldVal) => {
  if (newVal === undefined) {
    value.value = newVal
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

})
</script>

<style scoped lang="scss">
</style>
