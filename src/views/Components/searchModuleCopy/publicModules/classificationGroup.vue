<template>
  <div class="class-group-flex">
    <ul :class="['formFlex-list', state ? 'formFlex-show' : 'formFlex-hide' ]">
      <li v-if="attributes.type === 'Array'" :class="['', value.indexOf(item.value) !== -1 ? 'activeB' : '' ]"
          v-for="(item, index) in listSelect" :key="index" @click="changeClick(item)">{{item.label}}</li>
      <li v-if="attributes.type === 'String'" :class="['colorR', value === item.value ? 'activeR' : '' ]"
          v-for="(item, index) in listSelect" :key="index" @click="changeClick(item)">{{item.label}}</li>
    </ul>
    <p class="operationBtn" @click="showhide(state)">
      {{state ? '收回' : '展开'}}
      <i v-if="state" class="iconfont icon-up"></i>
      <i v-else class="iconfont icon-down"></i>
    </p>
  </div>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
import { submitItem } from "@/api/index.js";
const store = useFormStore()

const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  },
})
const value = ref(null)
const label = ref(null)
const listSelect = shallowRef([])
value.value = props.attributes.type === 'Array' ? [''] : ''
label.value = props.attributes.type === 'Array' ? [''] : ''
const state = ref(false)

const emit = defineEmits(['changeFn']);
const changeClick = (param) => {
  if (props.attributes.type === 'String') {
    value.value = param.value
    label.value = param.label
  } else if (props.attributes.type === 'Array') {
    if (param.value === '') {
      label.value = [param.label]
      value.value = [param.value]
    } else {
      if (value.value.indexOf("") !== -1) {
        label.value = []
        value.value = []
      }
      const index = value.value.findIndex(item => item === param.value)
      if (index === -1) {
        value.value.push(param.value)
        label.value.push(param.label)
      } else {
        value.value.splice(index, 1)
        label.value.splice(index, 1)
      }
    }
  }
  setValue()
}

const setValue = () => {
  let name = label.value
  if (props.attributes.type === 'Array') {
    name = label.value.join("、")
  }
  store.setSearchFormRecord({ name: props.attributes.label, value: name, key: props.attributes.key })
  store.setSearchRuleForm(value, props.attributes.key)
}

const showhide = (param) => {
  state.value = param ? false : true
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
      const list = data.map(item => ({
        label: item[label],
        value: item[value]
      }))
      listSelect.value = [{ label: '全部', value: '' }, ...list ]
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
    label.value = []
  }
})

onMounted(() => {
  fetchData()
})

</script>

<style scoped lang="scss">
.class-group-flex{
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  .formFlex-list{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    padding: 3px 0 3px 3px;
    li{
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 5px $grey-dark;
      cursor: pointer;
      line-height: 30px;
      padding: 0 10px;
      margin: 0 15px 10px 0;
      font-size: 14px;
      color: $black-color;
      min-width: 80px;
      text-align: center;
    }
    li:hover{
      color: $mainPrimary;
    }
    li.activeB{
      color: $white;
      box-shadow: 0 0 5px $mainPrimaryHex;
      background-color: $mainPrimaryHex;
    }
    .colorR:hover{
      color: $red-dark;
    }
    li.activeR{
      color: $white !important;
      box-shadow: 0 0 5px $red-light;
      background-color: $red-light;
    }
  }
  .formFlex-show {
    height: auto !important; overflow: auto;
    animation: grow .8s;
  }
  .formFlex-hide{
    height: 32px; overflow: hidden;
    animation: closed .8s;
  }
  @keyframes grow {
    from { height: 32px; overflow: hidden;}
    to { height: auto !important; overflow: auto; }
  }
  @keyframes closed {
    from { height: auto; overflow: auto;}
    to { height: 32px; overflow: hidden;}
  }
  .operationBtn{
    width: 60px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    cursor: pointer;
    color: $mainPrimary;
    .icon-down{
      position: relative;
      top: 2px;
    }
  }
}
</style>
