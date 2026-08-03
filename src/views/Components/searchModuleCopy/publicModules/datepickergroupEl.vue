<template>
  <el-form-item :label="state.label" :prop="attributes.key" class="class-group-select">
    <el-select v-model="key" :placeholder="state.placeholder" class="left-select" @change="changeSelect">
      <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
    </el-select>
    <el-date-picker v-if="state.type === 'date'" v-model="value" type="date" class="right-select" @change="changeRange" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :placeholder="state.placeholder"></el-date-picker>
    <el-date-picker v-if="state.type === 'daterange'" v-model="value" type="daterange" class="right-select" @change="changeRange" range-separator="至" format="YYYY-MM-DD" value-format="YYYY-MM-DD" start-placeholder="起始日期" end-placeholder="截止日期" />
  </el-form-item>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
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
value.value = props.attributes.type === 'daterange' ? ['', ''] : ''
const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: props.attributes.label,
  type: props.attributes.type,
  keyHistory: '',
  nameHistory: ''
})

const emit = defineEmits(['changeFn']);

const changeSelect = (param) => {
  if (state.value.keyHistory && state.value.keyHistory !== param ) {
    store.setSearchRuleForm(null, state.value.keyHistory)
  }
  state.value.keyHistory = param
  setStore()
}

const changeRange = (param) => {
  value.value = param
  setStore()
}

const setStore = () => {
  if (key.value && value.value) {
    const index = list.value.findIndex(item => item.value === key.value)
    let name = list.value[index].label + ":" + value.value
    if (Array.isArray(value.value)){
      name = list.value[index].label + ":" + value.value.join("/")
    }
    store.setSearchFormRecord({ name: props.attributes.label, value: name, key: props.attributes.key })
    store.setSearchRuleForm(value.value, key.value)
  } else {
    store.setSearchFormRecord({ name: props.attributes.label, value: null, key: props.attributes.key })
    store.setSearchRuleForm(null, key.value)
  }
}

watch(() => store.searchRuleForm[key.value], (newVal, oldVal) => {
  if(newVal === undefined) {
    key.value = ''
    value.value = ['', '']
  }
})

onMounted(() => {
  list.value = props.attributes.list || []
})

</script>

<style scoped lang="scss">
.class-group-select{
  display: inline-block;
  padding-right: 2px;
  margin-left: 1px;
}
</style>
