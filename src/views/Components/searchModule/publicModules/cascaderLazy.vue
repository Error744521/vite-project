<template>
  <el-form-item :label="state.label" :prop="attributes.key" >
    <el-cascader v-model="value" :options="listSelect" :props="stareProps" :placeholder="state.placeholder" :filterable="state.filterable" clearable
                 collapse-tags @change="handleChange($event)" />
  </el-form-item>
</template>

<script setup>
import { ref, shallowRef, watch, onMounted } from 'vue'
import { useFormStore } from "@/store/formation.js";
import { submitItem } from "@/api/index.js";
const store = useFormStore()
const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  },
})
const emit = defineEmits(['changeFn']);
const stareProps = ref({
  multiple: false,
  checkStrictly: true,
  emitPath: false,
  showPrefix: false,
  checkOnClickNode: false,
  lazy: true,
  lazyLoad: async (node, resolve) => {
    const { level, value, label } = node
    const nodes = await fetchData({ level, value })
    handleChange(value, label)
    resolve(nodes)
  }
})
const listSelect = ref([])
const findNodeslist = ref([])
const value = ref(null)
const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: '请选择' + props.attributes.label,
  filterable: false, //是否支持搜索
})

const labelName = ref('')
const handleChange = (param, label) => {
  if (param === '' || param === undefined || (Array.isArray(param) && param.length === 0)) {
    labelName.value = ''
    value.value = ''
  } else {
    if (label) {
      labelName.value = label
    } else {
      const item = findNodeslist.value.find(item => item.value === param);
      labelName.value = item && item.label ? item.label : ''
    }
    value.value = param
  }
  setValue()
}

const setValue = () => {
  store.setSearchFormRecord({ name: props.attributes.label, value: labelName.value, key: props.attributes.key })
  store.setSearchRuleForm(value.value, props.attributes.key)
}

const fetchData = async({ level, value }) => {
  const { request } = props.attributes
  try {
    if (!request || !request.url) return []
    const { url, method = 'get', param = {}  } = request
    const response = await submitItem(url, method, { ...param, [request.key]: value })
    if (response.code === 200) {
      const data = response.data || response
      const list = data.map(item => ({
        label: item[request.label],
        value: item[request.value],
        leaf: item.leaf !== undefined ? item.leaf : level >= 2
      }))
      findNodeslist.value = list
      return list
    } else {
      console.warn('API request failed:', response.message)
      return []
    }
  } catch (error) {
    console.error('Fetch error:', error)
    return []
  }
}

watch(() => store.searchRuleForm[props.attributes.key], (newVal, oldVal) => {
  if (newVal === undefined) {
    value.value = newVal
  }
})


onMounted(() => {

})

</script>

<style scoped lang="scss">
.search-form-cascader{
  .el-cascader-node__prefix{
    position: absolute !important;
  }
}
</style>
