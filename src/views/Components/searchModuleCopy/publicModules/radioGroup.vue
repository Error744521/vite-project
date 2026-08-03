<template>
  <el-form-item :label="state.label" :prop="attributes.key">
    <el-radio-group v-model="value" @change="changeInput" class="class-padding-p-line">
      <el-radio v-if="attributes.type === 'radio'" v-for="(item, index) in list" :key="index" :value="item.value">{{item.label}}</el-radio>
      <el-radio-button v-if="attributes.type === 'button'" v-for="(item, index) in list" :key="index" :value="item.value">
        <span class="class-radio-button">{{item.label}}</span>
      </el-radio-button>
    </el-radio-group>
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
const value = ref('')
const list = ref([])

const state = shallowRef({
  label: props.attributes.show ? props.attributes.label : '',
  placeholder: '请选择' + props.attributes.label,
  maxlength: props.attributes.maxlength,
  type: props.attributes.type
})

const emit = defineEmits(['changeFn']);
const changeInput = (param) => {
  const item = list.value.find(item => item.value === param)
  store.setSearchFormRecord({ name: props.attributes.label, value: item.label, key: props.attributes.key })
  store.setSearchRuleForm(param, props.attributes.key)
/*  emit('changeFn', target)*/
}

watch(() => store.searchRuleForm[props.attributes.key], (newVal, oldVal) => {
  if (newVal === undefined) {
    value.value = ''
  }
})

onMounted(() => {
  list.value = props.attributes.list
})

</script>

<style scoped lang="scss">
.class-radio-button{
  display: inline-block;
  min-width: 80px;
}
</style>
