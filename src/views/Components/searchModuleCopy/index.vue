<template>
  <div class="class-search" v-loading="loading">
    <span class="iconScreening" @click="handleOpen(switchKG)">
      <i :class="['iconfont', switchKG ? 'icon-menu-up' : 'icon-menu-down']"></i>
    </span>
    <el-form ref="ruleForm" :model="ruleForm" :inline="true" :label-width="props.width" :class="[switchKG ? 'demo-form-inline' : 'demo-form-block']">
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
      formFields.value = props.formData.map((item) => ({
        ...item,
        Options: setObj(item.Options || {})
      }))
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

<style scoped lang="scss">
@use './index.scss';

</style>
