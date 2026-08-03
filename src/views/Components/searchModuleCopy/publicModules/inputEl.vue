<template>
  <el-form-item :label="state.label" :prop="attributes.key" :label-width="state.labelWidth">
    <el-input v-model="value" :placeholder="state.placeholder" :type="state.type" show-word-limit :maxlength="state.maxlength" @blur="changeInput" />
  </el-form-item>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
const store = useFormStore()

const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  }
})
const value = ref('')
const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  labelWidth: props.attributes.labelWidth,
  placeholder: '请选择' + props.attributes.label,
  maxlength: props.attributes.maxlength,
  type: props.attributes.type
})

const emit = defineEmits(['changeFn']);
const changeInput = () => {
  store.setSearchFormRecord({ name: props.attributes.label, value: value.value, key: props.attributes.key })
  store.setSearchRuleForm(value.value, props.attributes.key)
/*  emit('changeFn', { [props.attributes.key]: value.value } )*/
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
