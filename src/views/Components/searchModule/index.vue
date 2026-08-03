<template>
  <div class="class-search" v-loading="loading">
    <span class="iconScreening" @click="handleOpen(switchKG)">
      <i :class="['iconfont', switchKG ? 'icon-menu-up' : 'icon-menu-down']"></i>
    </span>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :inline="true"
      :label-width="props.width"
      :class="[switchKG ? 'demo-form-inline' : 'demo-form-block']"
    >
      <div class="formFlex" v-for="(group, index) in formFields" :key="index">
        <p class="formFlex-label" v-if="group.label">{{ group.label }}：</p>
        <div class="formFlex-list" v-if="group.Options && group.Options.length > 0">
          <p class="p-line" v-for="(field, fieldIndex) in group.Options" :key="fieldIndex">
            <component :is="getComponent(field.component)" :attributes="field.attributes" />
          </p>
        </div>
      </div>
    </el-form>
    <div class="class-search-btn">
      <searchCriteria class="flexWidth" ref="searchRef"></searchCriteria>
      <el-form-item label="" class="flexForm">
        <el-button type="primary" @click="onSubmit" :icon="Search">搜索</el-button>
        <el-button @click="onRefresh" :icon="Refresh">重置</el-button>
      </el-form-item>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useFormStore } from '@/store/formation.js'
import { Search, Refresh } from '@element-plus/icons-vue'
import components from './index.js'
import searchCriteria from './publicModules/searchCriteria.vue'
import searchFormFn from '@views/Components/searchModule/public.js'

const store = useFormStore()
const emit = defineEmits(['setCallback'])
const getComponent = (name) => components[name]
const props = defineProps({
  formData: { type: Array, default: () => [] },
  width: { type: String, default: () => {} },
  show: { type: Boolean, default: false },
  keys: { type: String, default: () => 'public' }
})
const ruleForm = ref({})
const loading = ref(false)
const switchKG = ref(false)
const formFields = ref([])

const onSubmit = () => {
  ruleForm.value = { ...store.getSearchRuleForm, page: 1, pagesize: 15 }
  emit('setCallback', ruleForm.value)
}

const onRefresh = () => {
  ruleForm.value = {}
  store.clearRuleForm()
}

const handleOpen = (status) => {
  switchKG.value = !status
}

const loadFormFields = async () => {
  const ObjectForm = await searchFormFn(props.keys)
  const setObj = (param) => {
    const keys = Object.keys(param)
    return keys.reduce((acc, key) => {
      if (ObjectForm[key] && ObjectForm[key].attributes) {
        const field = { ...ObjectForm[key] }
        field.attributes = { ...field.attributes, labelShow: props.show, labelWidth: props.width }
        acc.push(field)
      }
      return acc
    }, [])
  }

  if (Object.prototype.toString.call(ObjectForm) === '[object Object]') {
    if (Array.isArray(props.formData)) {
      formFields.value = props.formData.map((item) => ({ ...item, Options: setObj(item.Options) }))
    } else {
      formFields.value = [{ label: '', Options: setObj(props.formData) }]
    }
  }
}

watch([() => props.keys, () => props.formData], loadFormFields, { immediate: true })

onMounted(() => {
  loadFormFields()
})
</script>

<style scoped lang="scss">@use './index'; .class-search { background: $white; border-radius: 0 0 5px 5px; position: relative; margin-bottom: 10px; .iconScreening { width: 20px; height: 30px; display: block; position: absolute; right: 10px; top: 10px; cursor: pointer; i { font-size: 18px; font-weight: bold; color: $purple-color; } } .iconScreening:hover { i::after { position: absolute; top: 20px; left: -5px; width: 34px; background: $white; color: $purple-color; font-size: 10px; padding: 0 5px; border-radius: 5px; } i.icon-menu-up::after { content: '展开'; } i.icon-menu-down::after { content: '收起'; } } .formlineBlock { display: flex; flex-wrap: wrap; } .formFlex { display: flex; flex-wrap: wrap; .formFlex-label { height: 30px; line-height: 34px; width: 90px; font-size: 16px; color: $black-dark; } .formFlex-list { flex: 1; .p-line { display: inline-block; } } } .formTabBlock { display: flex; flex-wrap: wrap; } .class-search-btn { display: flex; flex-wrap: nowrap; .flexWidth { flex: 1; width: calc(100% - 200px); } .flexForm { padding-left: 10px; width: 200px; margin: 0 !important; :deep(.el-form-item__content) { justify-content: right !important; } } } .demo-form-block { height: 100%; max-height: 100%; div.formFlex { display: inline-block; } } .demo-form-inline { height: auto; min-height: 100%; max-height: 0; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); will-change: max-height, padding; div.formFlex { display: none; } &.expanded { max-height: 500px; opacity: 1; padding: 12px 0; } div:nth-child(1) { display: inline-block; } } }</style>
