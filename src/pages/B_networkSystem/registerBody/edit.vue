<template>
  <div class="index-content-page">
    <div class="page-header-sticky">
      <page-secondary-header :title="pageTitle" sub-title="主体信息" />
    </div>
    <div class="module_card" v-loading="state.loading">
      <rule-form-module v-model="state.formModel" :fields="formFields" label-width="160px" submit-text="保存" @submit="handleSubmit" @reset="handleReset"/>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import RuleFormModule from '@views/Components/ruleFormModule/index.vue'
import ObjectForm from '@views/Components/ruleFormModule/public.js'
import { submitItem } from '@/api/index.js'
import { useFormStore } from '@/store/formation.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()
const parentPageKey = computed(() => route.meta?.parentPageKey || 'registerBodyIndex')
const defaultFormModel = () => ({
  company_name: '',
  credit_code: '',
  legal_person: '',
  capital: '',
  industry_id: '',
  company_type_ids: [],
  company_address: ''
})
const state = reactive({
  loading: false,
  formModel: defaultFormModel()
})

const pageTitle = computed(() => route.params.id ? '编辑主体' : '新增主体')
const isEdit = computed(() => Boolean(route.params.id))
const detailUrl = computed(() => `/v1/companies/${route.params.id}`)
const formFields = computed(() => [
  ObjectForm.company_name,
  ObjectForm.credit_code,
  {
    component: 'inputForm',
    type: 'text',
    label: '法定代表人',
    key: 'legal_person',
    maxlength: 50,
    rules: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }]
  },
  {
    component: 'inputForm',
    type: 'text',
    label: '注册资本',
    key: 'capital',
    maxlength: 50
  },
  {
    component: 'selectForm',
    type: 'string',
    label: '行业类型',
    key: 'industry_id',
    filterable: true,
    options: [],
    request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
  },
  {
    component: 'cascaderForm',
    type: 'string',
    label: '主体性质',
    key: 'company_type_ids',
    multiple: false,
    emitPath: false,
    options: [],
    request: { url: '/v1/company/typetree', method: 'get', param: {}, label: 'company_type_name', value: 'id' }
  },
  {
    ...ObjectForm.link_address,
    label: '主体地址',
    key: 'company_address',
    rows: 4,
    maxlength: 200,
    rules: [{ required: true, message: '请输入主体地址', trigger: 'blur' }]
  }
])

const normalizeDetailData = (data = {}) => ({
  ...defaultFormModel(),
  ...data,
  company_type_ids: Array.isArray(data.company_type_ids) ? data.company_type_ids : []
})

const getDetail = async () => {
  if (!isEdit.value) return
  state.loading = true
  const res = await submitItem(detailUrl.value, 'get', {}, { silent: true })
  state.loading = false
  if (res.code === 200) {
    state.formModel = normalizeDetailData(res.data || {})
    return
  }
  ElMessage.error(res.msg || '主体信息获取失败')
}

const handleSubmit = async (data) => {
  state.loading = true
  const res = await submitItem(
    isEdit.value ? detailUrl.value : '/v1/companies',
    isEdit.value ? 'put' : 'post',
    data,
    { showSuccess: true, successMessage: isEdit.value ? '主体信息保存成功' : '主体信息新增成功' }
  )
  state.loading = false
  if (![200, 201, 204].includes(Number(res.code))) return

  formStore.setNavigationIntent(parentPageKey.value, 'detailUpdated')
  router.back()
}

const handleReset = (data) => {
  state.formModel = { ...data }
}

onMounted(getDetail)
</script>

<style scoped lang="scss">
.index-content-page {
  padding: 5px;
  height: 100%;
  overflow: auto;
  background-color: $white;
  &::-webkit-scrollbar {
    display: none;
  }
  .module_card{
    padding-top: 5vh;
    width: 80%;
    margin: 0 auto;
  }
}
.page-header-sticky {
  padding-top: 5px;
  position: sticky;
  top: 0;
  z-index: 20;
}
</style>
