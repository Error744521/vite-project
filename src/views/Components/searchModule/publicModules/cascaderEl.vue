<template>
  <el-form-item :label="state.label" :prop="attributes.key" >
    <el-cascader v-model="value" :options="listSelect" :props="stareProps" :placeholder="state.placeholder"
       :show-all-levels="state.showAllLevels" :filterable="state.filterable" collapse-tags clearable show-checked-strategy="child"
        @change="handleChange" @focus="fetchData" />
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
  showPrefix: true,
  multiple: props.attributes.type === 'Array' ? true : false,
  emitPath: props.attributes.type === 'Array' ? false : true,
})
const listSelect = ref([])
const value = ref(null)
value.value = props.attributes.type === 'Array' ? [] : ''

const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: '请选择' + props.attributes.label,
  filterable: true, //是否支持搜索
  showAllLevels: props.attributes.type === 'Array' ? false : true, //输入框中是否显示选中值的完整路径
})

const labelName = ref('')
const handleChange = (param) => {
  let verification = false
  if (param instanceof Array) {
    verification = param.indexOf("") !== -1
  }
  if (param === '' || verification || param === undefined) {
    labelName.value = param === '' ? '全部' : ''
    value.value = verification ? [''] : ''
  } else {
    labelName.value = ''
    value.value = param
    filterItem(param, listSelect.value)
  }
  setValue()
}
const setValue = () => {
  store.setSearchFormRecord({ name: props.attributes.label, value: labelName.value, key: props.attributes.key })
  store.setSearchRuleForm(value.value, props.attributes.key)
}
const filterItem = (param, list ) => {
  list.filter(item => {
    if (item.value === param || param instanceof Array && param.indexOf(item.value) !== -1) {
      if (param instanceof Array) {
        labelName.value = labelName.value ? labelName.value + '、' + item.label : item.label
        value.value.push(item.value)
      } else {
        labelName.value = item.label
        value.value = item.value
        return false
      }
    }
    if (item.children && item.children.length > 0) {
      filterItem(param, item.children)
    }
  })
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
      const list = (data) => {
        return data.map(item => {
          if(item.children && item.children.length > 0) {
            item.children = list(item.children)
          }
          item.label = item[label]
          item.value = item[value]
          return item
        })
      }
      listSelect.value = list(data)
    } else {
      console.warn('API request failed:', response.message)
    }
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

onMounted(() => {
  const { type, key } = props.attributes
  if (type === 'Array') {
    stareProps.value.showPrefix = true
    stareProps.value.multiple = true
  }
  if (type === 'String') {
    stareProps.value = { checkStrictly: true, showPrefix: true, }
  }
})

</script>

<style scoped lang="scss">
.search-form-cascader{
  .el-cascader-node__prefix{
    position: absolute !important;
  }
}
:deep(.el-cascader__tags) {
  flex-wrap: nowrap;
}
:deep(.cascader__tags) {
  width: initial;
}
</style>
