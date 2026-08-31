<template>
  <dialog-dom :visible="visible" title="异常处理" width="50%" :loading="dialogLoading" :show-footer="false" @close="handleClose"
    @update:visible="emit('update:visible', $event)"
  >
    <template #content>
      <p class="export-tips">数据将转入异常数据列表</p>
      <rule-form-module ref="formRef" v-model="formModel" :fields="formFields" label-width="100px" @submit="handleSubmit"/>
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
  unusual_type: ''
})

const dialogLoading = computed(() => props.loading || submitLoading.value)

const formFields = [
  {
    component: 'selectForm',
    label: '异常原因:',
    key: 'unusual_type',
    placeholder: '请选择异常原因',
    request: {
      url: '/v1/unusual/type',
      method: 'post',
      param: {},
      label: 'unusual_name',
      value: 'id'
    },
    rules: [{ required: true, message: '请选择异常原因', trigger: 'change' }]
  }
]

watch(() => props.visible, (visible) => {
  if (visible) return
  formModel.value = {
    unusual_type: ''
  }
})

const getSubmitParam = (data) => ({
  ...props.operation?.request?.param,
  unusual_type: data.unusual_type
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
  margin: 32px auto 0;
  width: 360px;
}
.export-tips {
  margin: 0 5em 18px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}
</style>
