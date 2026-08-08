<template>
  <div class="class-table-screen">
    <el-select class="select_flag" v-model="order_flag" placeholder="排序方式" @change="handleSelect">
      <el-option v-for="item in orderDefault" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select class="select_flag" v-model="sort_val" placeholder="排序类型" @change="changeSelect">
      <el-option v-for="item in sortDefault" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script setup>
import {useFormStore} from '@/store/formation.js'
import {submitItem} from '@/api/index.js'

const store = useFormStore()
const props = defineProps({
  screeTable: {
    type: Object, default: () => {
    }
  }
})
const order_flag = ref('')
const sort_val = ref('')
const orderDefault = ref([])
const sortDefault = ref([])
const handleSelect = (val) => {
  order_flag.value = val
  if (props.screeTable.select && props.screeTable.select.url) {
    const param = {id: val}
    submitItem(props.screeTable.select.url, props.screeTable.select.methods, param).then((res) => {
      if (res.code == 200) {
        sortDefault.value = res.data
      }
    })
  }
}
const changeSelect = (val) => {
  sort_val.value = val
  store.setSearchRuleForm({order_flag: order_flag.value, sort_val: val})
}
watch(() => [store.searchRuleForm.order_flag, store.searchRuleForm.sort_val], (newVal, oldVal) => { //searchRuleForm
  if (newVal[0] === undefined && newVal[1] === undefined) {
    order_flag.value = ''
    sort_val.value = ''
  }
})
onMounted(() => {
  if (props.screeTable.sorting && props.screeTable.sorting.list) {
    orderDefault.value = props.screeTable.sorting.list
  } else {
  }
  if (props.screeTable.select && props.screeTable.select.list) {
    sortDefault.value = props.screeTable.select.list
  }
})
</script>

<style scoped lang="scss">
.class-table-screen {
  display: block;
  .select_flag {
    width: 140px;
    margin-right: 10px;
  }
}
</style>
