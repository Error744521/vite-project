<template>
  <dialog-dom :visible="visible" title="添加标签" width="900px" :loading="dialogLoading" :show-footer="false" @close="handleClose"
    @update:visible="emit('update:visible', $event)">
    <template #content>
      <rule-form-module ref="formRef" v-model="formModel" :fields="formFields" label-width="0" @submit="handleSubmit"/>
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
  system_label_ids: [],
  industry_label_ids: [],
  preset_label_ids: [],
  own_label_names: ''
})

const dialogLoading = computed(() => props.loading || submitLoading.value)

const formFields = [
  {
    component: 'checkboxGroupForm',
    key: 'system_label_ids',
    show: false,
    title: '系统标签:',
    description: '（勾选系统标签数据会同步到相应子系统中）',
    request: {
      url: '/v1/labels/info',
      method: 'post',
      param: { common_flag: 3, target_id: 0, target_type: props.operation.request.param },
      label: 'label_name',
      value: 'id'
    }
  },
  {
    component: 'checkboxGroupForm',
    key: 'industry_label_ids',
    show: false,
    title: '行业标签:',
    description: '（行业标签，数据会同步到行业库）',
    request: {
      url: '/v1/labels/info',
      method: 'post',
      param: { common_flag: 4, target_id: 0, target_type: 3 },
      label: 'label_name',
      value: 'id'
    }
  },
  {
    component: 'checkboxGroupForm',
    key: 'preset_label_ids',
    show: false,
    title: '数据预设标签:',
    description: '（常用标签，数据不会同步到子系统）',
    request: {
      url: '/v1/labels/info',
      method: 'post',
      param: { common_flag: 1, target_id: 0, target_type: 3 },
      label: 'label_name',
      value: 'id'
    }
  },
  {
    component: 'inputForm',
    key: 'own_label_names',
    show: false,
    title: '自定义标签:',
    placeholder: '请输入标签，如多个标签请用“空格”分割',
    width: '100%'
  }
]

watch(() => props.visible, (visible) => {
  if (visible) return
  formModel.value = {
    system_label_ids: [],
    industry_label_ids: [],
    preset_label_ids: [],
    own_label_names: ''
  }
})

const getSubmitParam = (data) => ({
  ...props.operation?.request?.param,
  system_label_ids: data.system_label_ids || [],
  industry_label_ids: data.industry_label_ids || [],
  preset_label_ids: data.preset_label_ids || [],
  own_label_names: data.own_label_names || ''
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
  margin: 12px 52px 0 52px;
}

:deep(.el-form-item) {
  margin-bottom: 34px;
}

:deep(.class-form-button) {
  margin: 12px -52px 0 -52px;
  padding: 16px 0 0 0;
  border-top: 1px solid var(--el-border-color);
}

:deep(.class-form-button .el-form-item__content) {
  justify-content: center !important;
  gap: 8px;
}

:deep(.class-form-button .el-button) {
  min-width: 114px;
}
</style>
