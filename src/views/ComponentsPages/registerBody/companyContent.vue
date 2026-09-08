<script setup>
import { submitItem } from '@/api/index.js'
import { useMultipleStore } from '@/store/selectionMultiple.js'
import CompanyHandover from './companyHandover.vue'

const props = defineProps({
  itemData: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: Number,
    default: 3
  }
})
const emit = defineEmits(['callback', 'handover-submit'])

const multipleStore = useMultipleStore()

const emptyValues = ['', null, undefined]
const isEditing = ref(false)
const isSaving = ref(false)
const isOptionLoading = ref(false)
const handoverVisible = ref(false)
const handoverAction = ref('')
const handoverModel = ref({})
const editModel = ref({})
const industryOptions = ref([])
const companyTypeOptions = ref([])
const cascaderProps = {
  checkStrictly: true,
  emitPath: false,
  value: 'value',
  label: 'label',
  children: 'children'
}

const getValue = (...keys) => {
  const value = keys.map((key) => props.itemData?.[key]).find((item) => !emptyValues.includes(item))
  return value ?? '--'
}

const formatEditValue = (value) => {
  return value === '--' ? '' : value
}

const getBusinessPeriod = () => {
  const directValue = getValue('business_period', 'business_term', 'operating_period')
  if (directValue !== '--') return directValue

  const start = getValue('business_start_date', 'business_start', 'start_date')
  const end = getValue('business_end_date', 'business_end', 'end_date')
  if (start === '--' && end === '--') return '--'
  return `${start === '--' ? '' : start} 至 ${end === '--' ? '' : end}`.trim()
}

const normalizeOptionTree = (list = [], labelKey, valueKey) => {
  return list.map((item) => {
    const children = Array.isArray(item.children) ? normalizeOptionTree(item.children, labelKey, valueKey) : []
    return {
      label: item[labelKey] ?? item.label ?? item.name ?? '',
      value: item[valueKey] ?? item.value ?? item.id ?? '',
      children
    }
  })
}

const loadFieldOptions = async () => {
  if (industryOptions.value.length > 0 && companyTypeOptions.value.length > 0) return
  isOptionLoading.value = true
  const [industryRes, companyTypeRes] = await Promise.all([
    submitItem('/v1/company/industrytree', 'get', {}, { silent: true }),
    submitItem('/v1/company/typetree', 'get', {}, { silent: true })
  ])
  isOptionLoading.value = false

  if (industryRes.code === 200) {
    industryOptions.value = normalizeOptionTree(industryRes.data || [], 'industry', 'id')
  }
  if (companyTypeRes.code === 200) {
    companyTypeOptions.value = normalizeOptionTree(companyTypeRes.data || [], 'company_type_name', 'id')
  }
}

const getDisplayValue = (...keys) => {
  return keys.map((key) => props.itemData?.[key]).find((item) => !emptyValues.includes(item)) ?? '--'
}

const fieldRows = computed(() => [
  [
    { label: '企业名称', modelKey: 'company_name', value: getValue('company_name') },
    { label: '信用代码', modelKey: 'credit_code', value: getValue('credit_code') }
  ],
  [
    { label: '法定代表人', modelKey: 'legal_person', value: getValue('legal_person') },
    {
      label: '登记状态',
      modelKey: 'company_status',
      value: getValue('company_status_name', 'company_status'),
      control: 'cascader',
      options: multipleStore.getCompanyStatus
    }
  ],
  [
    { label: '成立日期', modelKey: 'establish_date', value: getValue('establish_date', 'establishment_date', 'created_at'), control: 'date' },
    {
      label: '企业类型',
      modelKey: 'company_type_id',
      value: getValue('company_type_name', 'company_type_names', 'enterprise_type'),
      control: 'cascader',
      options: companyTypeOptions.value
    }
  ],
  [
    { label: '注册资本', modelKey: 'capital', value: getValue('capital', 'registered_capital') },
    { label: '工商注册号', modelKey: 'registration_number', value: getValue('registration_number', 'business_registration_number', 'reg_no') }
  ],
  [
    { label: '营业期限', modelKey: 'business_period', value: getBusinessPeriod() },
    { label: '登记机关', modelKey: 'registration_authority', value: getValue('registration_authority', 'reg_org', 'register_org') }
  ],
  [
    { label: '联系方式', modelKey: 'contact_phone', value: getValue('contact_phone', 'link_phone', 'phone') },
    { label: '注册地址', modelKey: 'register_address', value: getValue('register_address', 'registered_address', 'company_address', 'address') }
  ]
])

const businessScope = computed(() => getValue('scope_name', 'business_scope', 'scope'))
const scopeField = computed(() => ({
  label: '经营范围',
  modelKey: 'scope_name',
  value: businessScope.value,
  control: 'textarea'
}))
const hasData = computed(() => {
  return fieldRows.value.flat().some((item) => item.value !== '--') || businessScope.value !== '--'
})
const isCompanyType = computed(() => Number(props.type) === 3)
const actionList = computed(() => {
  if (isEditing.value) {
    return [
      { label: '保存', action: 'save', icon: 'iconbaocun' },
      { label: '取消', action: 'cancel', icon: 'icona-quxiao5' }
    ]
  }
  if (!hasData.value) return [{ label: '添加', action: 'add', icon: 'iconicon-import' }]
  if (isCompanyType.value) return [{ label: '编辑', action: 'edit', icon: 'iconluru' }]
  if (hasData.value) {
    return [
      { label: '编辑', action: 'edit', icon: 'iconluru' },
      { label: '更改', action: 'change', icon: 'iconsuijifenzu' }
    ]
  }
  return []
})
const handoverTitle = computed(() => {
  return handoverAction.value === 'change' ? '更改主体信息' : '填写主体信息'
})

const createHandoverModel = (action) => {
  if (action === 'add') return {}
  return {
    company_name: formatEditValue(getDisplayValue('company_name')),
    credit_code: formatEditValue(getDisplayValue('credit_code')),
    area_ids: formatEditValue(getDisplayValue('area_id', 'area_ids')),
    company_address: formatEditValue(getDisplayValue('company_address', 'address')),
    registration_authority: formatEditValue(getDisplayValue('registration_authority', 'reg_org', 'register_org'))
  }
}

const initEditModel = () => {
  editModel.value = {
    ...props.itemData,
    company_name: formatEditValue(getDisplayValue('company_name')),
    credit_code: formatEditValue(getDisplayValue('credit_code')),
    legal_person: formatEditValue(getDisplayValue('legal_person')),
    company_status: formatEditValue(getDisplayValue('company_status')),
    establish_date: formatEditValue(getDisplayValue('establish_date', 'establishment_date', 'created_at')),
    company_type_id: formatEditValue(getDisplayValue('company_type_id', 'company_type_ids')),
    capital: formatEditValue(getDisplayValue('capital', 'registered_capital')),
    registration_number: formatEditValue(getDisplayValue('registration_number', 'business_registration_number', 'reg_no')),
    business_period: formatEditValue(getBusinessPeriod()),
    registration_authority: formatEditValue(getDisplayValue('registration_authority', 'reg_org', 'register_org')),
    contact_phone: formatEditValue(getDisplayValue('contact_phone', 'link_phone', 'phone')),
    register_address: formatEditValue(getDisplayValue('register_address', 'registered_address', 'company_address', 'address')),
    scope_name: formatEditValue(getDisplayValue('scope_name', 'business_scope', 'scope'))
  }
}

const startEdit = async () => {
  initEditModel()
  isEditing.value = true
  await loadFieldOptions()
}

const cancelEdit = () => {
  isEditing.value = false
  editModel.value = {}
}

const getSubmitParam = () => {
  return [...fieldRows.value.flat(), scopeField.value].reduce((result, item) => {
    result[item.modelKey] = editModel.value[item.modelKey]
    return result
  }, {})
}

const saveEdit = async () => {
  if (!props.itemData?.id) return
  isSaving.value = true
  const res = await submitItem(`/v1/companies/${props.itemData.id}`, 'put', getSubmitParam(), {
    showSuccess: true,
    successMessage: '主体信息保存成功'
  })
  isSaving.value = false
  if (![200, 201, 204].includes(Number(res.code))) return
  isEditing.value = false
  emit('callback')
}

const openHandover = (action) => {
  handoverAction.value = action
  handoverModel.value = createHandoverModel(action)
  handoverVisible.value = true
}

const handleHandoverSubmit = (data) => {
  emit('handover-submit', {
    action: handoverAction.value,
    data
  })
}

const handleHandoverClose = () => {
  handoverAction.value = ''
  handoverModel.value = {}
}

const handleAction = async (action) => {
  if (action === 'edit') {
    await startEdit()
    return
  }
  if (action === 'cancel') {
    cancelEdit()
    return
  }
  if (action === 'save') {
    await saveEdit()
    return
  }
  if (['add', 'change'].includes(action)) {
    openHandover(action)
  }
}
</script>

<template>
  <section class="company-content">
    <div class="company-content__header">
      <h3>主体信息</h3>
      <div class="company-content__actions">
        <el-button v-for="item in actionList" :key="item.action" class="company-content__edit" :loading="item.action === 'save' && isSaving" link type="primary" @click="handleAction(item.action)">
          <i :class="['iconfont', item.icon]"></i> {{ item.label }}
        </el-button>
      </div>
    </div>
    <el-empty v-if="!hasData && !isEditing" description="暂无数据" />
    <div v-else v-loading="isOptionLoading" class="company-content__table">
      <div v-for="(row, rowIndex) in fieldRows" :key="rowIndex" class="company-content__row">
        <template v-for="item in row" :key="item.label">
          <div class="company-content__label">{{ item.label }}</div>
          <div :class="['company-content__value', { 'is-editing': isEditing }]">
            <template v-if="isEditing">
              <el-input v-if="!item.control" v-model="editModel[item.modelKey]" size="small" clearable />
              <el-date-picker v-else-if="item.control === 'date'" v-model="editModel[item.modelKey]" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" size="small" clearable/>
              <el-cascader v-else-if="item.control === 'cascader'" v-model="editModel[item.modelKey]" :options="item.options" :props="cascaderProps" placeholder="请选择" size="small" clearable/>
            </template>
            <template v-else>{{ item.value }}</template>
          </div>
        </template>
      </div>
      <div class="company-content__row">
        <div class="company-content__label">{{ scopeField.label }}</div>
        <div :class="['company-content__value', 'is-full', { 'is-editing': isEditing }]">
          <el-input v-if="isEditing" v-model="editModel[scopeField.modelKey]" type="textarea" :rows="5" maxlength="500" show-word-limit />
          <template v-else>{{ scopeField.value }}</template>
        </div>
      </div>
    </div>
    <CompanyHandover
      v-model:visible="handoverVisible"
      v-model="handoverModel"
      :title="handoverTitle"
      @submit="handleHandoverSubmit"
      @close="handleHandoverClose"
    />
  </section>
</template>

<style scoped lang="scss">
.el-empty{
  border: 1px solid $grey-color;
  border-radius: 3px;
}
.company-content {
  padding: 0 10px 18px;
}

.company-content__header {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    color: $black-dark;
    font-size: 16px;
    font-weight: 500;
  }
}

.company-content__edit {
  font-size: 14px;
  .iconfont{
    margin: 0 5px 0 0;
    position: relative;
    top: 2px;
  }
}

.company-content__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-content__table {
  border-top: 1px solid $grey-color;
  border-left: 1px solid $grey-color;
}

.company-content__row {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) 150px minmax(0, 1fr);
}

.company-content__label,
.company-content__value {
  min-height: 48px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-right: 1px solid $grey-color;
  border-bottom: 1px solid $grey-color;
  box-sizing: border-box;
}

.company-content__label {
  justify-content: flex-end;
  color: $black-color;
  background-color: $grey-light;
}

.company-content__value {
  color: $black-dark;
  word-break: break-all;

  &.is-full {
    grid-column: span 3;
  }

  &.is-editing {
    padding: 6px 10px;
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-cascader),
  :deep(.el-date-editor.el-input) {
    width: 100%;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    width: 100%;
    min-height: 34px;
    height: 34px;
    box-shadow: none;
    box-sizing: border-box;
  }

  :deep(.el-input__wrapper:hover),
  :deep(.el-input__wrapper.is-focus),
  :deep(.el-select__wrapper:hover),
  :deep(.el-select__wrapper.is-focused),
  :deep(.el-cascader .el-input.is-focus .el-input__wrapper) {
    box-shadow: none;
  }

  :deep(.el-textarea) {
    width: 100%;
  }

  :deep(.el-textarea__inner) {
    box-shadow: none;
  }
}

</style>
