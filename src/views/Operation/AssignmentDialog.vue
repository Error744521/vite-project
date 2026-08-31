<template>
  <dialog-dom
    :visible="visible"
    :title="title"
    :loading="dialogLoading"
    width="50%"
    :show-footer="false"
    @close="handleClose"
    @update:visible="emit('update:visible', $event)"
  >
    <template #content>
      <rule-form-module ref="formRef" v-model="formModel" :fields="formFields" label-width="100px" @submit="handleSubmit" />
    </template>
  </dialog-dom>
</template>

<script setup>
import DialogDom from '@/components/base/dialogDom.vue'
import RuleFormModule from '@views/Components/ruleFormModule/index.vue'
import { submitItem } from '@/api/index.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '数据指派'
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
  assign_type: 1,
  region: '',
  dept_id: ''
})

const dialogLoading = computed(() => props.loading || submitLoading.value)

const getSelectedOrgId = (value) => {
  if (Array.isArray(value)) return value[value.length - 1] || ''
  return value || ''
}

const formFields = computed(() => [
  {
    component: 'groupRadioForm',
    type: 'radio',
    label: '指派对象',
    key: 'assign_type',
    defaultValue: 1,
    options: [
      { label: '下级机构', value: 1 },
      { label: '同级部门', value: 2 }
    ],
    rules: [{ required: true, message: '请选择指派对象', trigger: 'change' }]
  },
  ...(formModel.value.assign_type === 1 ? [
    {
      component: 'cascaderForm',
      type: 'string',
      label: '指派机构',
      key: 'region',
      options: [],
      width: '100%',
      placeholder: '请选择机构',
      lazy: true,
      checkStrictly: true,
      emitPath: false,
      request: {
        url: '/v1/orgs/user',
        method: 'post',
        param: { org_id: '', show_fenliu: 0 },
        key: 'org_id',
        label: 'org_name',
        value: 'id',
        children: 'children'
      },
      rules: [{ required: true, message: '请选择机构', trigger: 'change' }]
    }
  ] : []),
  ...(formModel.value.assign_type === 2 ? [
    {
      component: 'selectForm',
      type: 'string',
      label: `指派部门`,
      key: 'dept_id',
      options: [],
      placeholder: '请选择部门',
      request: {
        url: '/v1/depts/org',
        method: 'post',
        param: { org_id: '' },
        label: 'dept_name',
        value: 'id'
      },
      rules: [{ required: true, message: '请选择部门', trigger: 'change' }]
    }
  ] : [])
])

watch(() => props.visible, (visible) => {
  if (!visible) {
    formRef.value?.resetForm()
  }
})

const handleSubmit = async (data) => {
  const { url, method, param } = props.operation?.request || {}
  if (!url || submitLoading.value) return
  submitLoading.value = true
  try {
    const orgId = getSelectedOrgId(data.region)
    const form = {
      ...data,
      ...param,
      org_id: data.assign_type === 1 ? orgId : '',
      region: undefined
    }
    const res = await submitItem(url, method || 'post', form)
    if (res.code === 200) {
      emit('confirm', data)
      handleClose()
    }
  } catch (error) {
    console.error('[AssignmentDialog] 指派请求失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss"></style>
