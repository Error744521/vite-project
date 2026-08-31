<template>
  <dialog-dom :visible="visible" title="分派" width="760px" :loading="dialogLoading" :show-footer="false" @close="handleClose"
    @update:visible="emit('update:visible', $event)"
  >
    <template #content>
      <rule-form-module ref="formRef" v-model="formModel" :fields="formFields" label-width="100px" @submit="handleSubmit" />
    </template>
  </dialog-dom>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import DialogDom from '@/components/base/dialogDom.vue'
import RuleFormModule from '@views/Components/ruleFormModule/index.vue'
import { submitItem } from '@/api/index.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  operation: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'close'])

const formRef = ref(null)
const submitLoading = ref(false)
const formModel = ref({
  dispatch_type: 1,
  org_id: '',
  dept_id: '',
  finish_days: 15
})

const dialogLoading = computed(() => props.loading || submitLoading.value)

const validateDispatchTarget = (_rule, _value, callback) => {
  if (formModel.value.dispatch_type === 1 && !formModel.value.org_id) {
    callback(new Error('请选择分派机构'))
    return
  }
  if (!formModel.value.dept_id) {
    callback(new Error('请选择部门'))
    return
  }
  callback()
}

const validateFinishDays = (_rule, value, callback) => {
  const days = Number(value)
  if (days === 0) {
    callback()
    return
  }
  if (!Number.isInteger(days) || days < 1) {
    callback(new Error('请输入完成期限'))
    return
  }
  callback()
}

const formFields = computed(() => [
  {
    component: 'groupRadioForm',
    type: 'radio',
    label: '分派对象',
    key: 'dispatch_type',
    defaultValue: 1,
    options: [
      { label: '机构', value: 1 },
      { label: '本级部门', value: 2 }
    ],
    rules: [{ required: true, message: '请选择分派对象', trigger: 'change' }]
  },
  {
    component: 'linkageSelectForm',
    label: '分派机构',
    key: 'dispatch_target',
    modelKeys: ['org_id', 'dept_id'],
    firstShow: formModel.value.dispatch_type !== 2,
    firstDisabled: formModel.value.dispatch_type === 2,
    first: {
      placeholder: '请选择分派机构',
      filterable: true,
      request: {
        url: '/v1/orgs/user',
        method: 'post',
        param: { org_id: '', show_fenliu: 0 },
        label: 'org_name',
        value: 'id',
        children: 'children'
      }
    },
    second: {
      placeholder: '请选择部门',
      filterable: true,
      request: {
        url: '/v1/depts/org',
        method: 'post',
        param: { org_id: '' },
        key: 'org_id',
        keepEmptyKeys: ['org_id'],
        label: 'dept_name',
        value: 'id'
      }
    },
    rules: [{ validator: validateDispatchTarget, trigger: 'change' }]
  },
  {
    component: 'deadlineForm',
    label: '完成期限',
    key: 'finish_days',
    defaultValue: 15,
    checkedValue: 0,
    min: 1,
    unit: '天',
    checkboxLabel: '不设置完成期限',
    rules: [{ validator: validateFinishDays, trigger: 'blur' }]
  }
])

watch(() => formModel.value.dispatch_type, (value, oldValue) => {
  if (value === oldValue) return
  formModel.value.org_id = ''
  formModel.value.dept_id = ''
  formModel.value.dispatch_target = { org_id: '', dept_id: '' }
})

watch(() => props.visible, (visible) => {
  if (visible) return
  formModel.value = {
    dispatch_type: 1,
    org_id: '',
    dept_id: '',
    finish_days: 15
  }
})

const getSubmitParam = (data) => ({
  ...props.operation?.request?.param,
  dispatch_type: data.dispatch_type,
  org_id: data.dispatch_type === 1 ? data.org_id : '',
  dept_id: data.dept_id,
  finish_days: Number(data.finish_days) || 0,
  no_deadline: Number(data.finish_days) === 0 ? 1 : 0
})

const handleSubmit = async (data) => {
  const { url, method } = props.operation?.request || {}
  if (!url) {
    ElMessage.warning('请求地址不存在')
    return
  }
  if (submitLoading.value) return

  submitLoading.value = true
  try {
    const response = await submitItem(url, method || 'post', getSubmitParam(data))
    if (Number(response?.code) === 200) {
      emit('confirm', data)
      emit('update:visible', false)
    }
  } finally {
    submitLoading.value = false
  }
}

const handleClose = () => {
  if (dialogLoading.value) return
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped lang="scss">
:deep(.demo-form) {
  margin: 2em 5em 0 5em;
}

:deep(.class-form-button) {
  margin: 32px -5em 0 -5em;
  padding: 8px 0 0 0;
  border-top: 1px solid var(--el-border-color);
}

:deep(.class-form-button .el-form-item__content) {
  justify-content: center !important;
  gap: 8px;
}

:deep(.class-form-button .el-button) {
  min-width: 108px;
}
</style>
