<template>
  <el-form-item :label="state.label" :prop="attributes.key" >
    <el-checkbox-group v-model="value" @change="changeInput" class="class-padding-p-line">
      <el-checkbox v-if="attributes.type === 'checkbox'" v-for="(item, index) in listSelect" :key="index" :label="item.label" :value="item.value"></el-checkbox>
      <el-checkbox-button v-if="attributes.type === 'button'" v-for="(item, index) in listSelect" :key="index" :label="item.label" :value="item.value">
        <span class="class-radio-button">{{item.label}}</span>
      </el-checkbox-button>
    </el-checkbox-group>
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
const value = ref([])
const listSelect = ref([])

const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: '请选择' + props.attributes.label,
  type: props.attributes.type
})

const emit = defineEmits(['changeFn']);
const changeInput = (param) => {
  const array = listSelect.value.filter(item => param.indexOf(item.value) !== -1)
  const name = array.map(item => item.label).join("、");
  store.setSearchFormRecord({ name: props.attributes.label, value: name, key: props.attributes.key })
  store.setSearchRuleForm(param, props.attributes.key)
}

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

watch(() => store.searchRuleForm[props.attributes.key], (newVal, oldVal) => {
  if(newVal === undefined){
    value.value = []
  }
})

onMounted(() => {
  fetchData()
})

</script>

<style scoped lang="scss">
.class-radio-button{
  display: inline-block;
  min-width: 80px;
}
</style>
