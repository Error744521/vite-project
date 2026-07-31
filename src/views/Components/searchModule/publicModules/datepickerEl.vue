<template>
  <el-form-item :label="state.show" :prop="state.key">
    <el-date-picker v-if="state.type === 'date'" v-model="value" :type="state.type" @change="changePicker" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :placeholder="state.placeholder"></el-date-picker>
    <el-date-picker v-if="state.type === 'daterange'" v-model="value" :type="state.type" @change="changePicker"
       start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :placeholder="state.placeholder"></el-date-picker>
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

const state = shallowRef({
  key: props.attributes.key,
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: '请选择' + props.attributes.label,
  type: props.attributes.type
})

const value = ref('')
const emit = defineEmits(['changeFn']);
const changePicker = (param) => {
  let label = param
  if (state.value.type === 'daterange') {
    label = param.join('/')
  }
  store.setSearchRuleForm(param, props.attributes.key)
  store.setSearchFormRecord({ name: props.attributes.label, value: label, key: props.attributes.key })
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
</style>
