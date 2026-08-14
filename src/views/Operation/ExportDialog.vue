<template>
  <dialog-dom
    :visible="visible"
    :title="title"
    :loading="loading"
    width="50%"
    :show-footer="false"
    @close="handleClose"
    @update:visible="emit('update:visible', $event)"
  >
    <template #content>
      <p class="export-tips">数据导出需要超管审核，审核通过后在导出记录下载使用</p>
      <rule-form-module ref="formRef" v-model="formModel" :fields="formFields" label-width="100px" @submit="handleSubmit" />
    </template>
  </dialog-dom>
</template>

<script setup>
import DialogDom from '@/components/base/dialogDom.vue'
import RuleFormModule from '@/views/Components/ruleFormModule/index.vue'
import {submitItem} from "@/api/index.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '数据导出'
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
const formModel = ref({
  export_reason: '',
  file_path: ''
})

const formFields = [
  {
    component: 'textareaForm',
    type: 'text',
    label: '导出原因',
    key: 'export_reason',
    rules: [{ required: true, message: '请输入导出原因', trigger: 'blur' }]
  },
  {
    component: 'uploadFileForm',
    type: 'string',
    label: '附件证明',
    key: 'file_path',
    accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx',
    text: '上传附件',
    tip: true,
    limit: 1,
    request: {
      url: '/v1/uploads/file',
      method: 'post',
      param: {}
    },
    rules: [{ required: true, message: '请上传附件证明', trigger: 'change' }]
  }
]

watch(() => props.visible, (visible) => {
  if (!visible) {
    formRef.value?.resetForm()
  }
})

const handleSubmit = async (data) => {
  props.loading = true
  const { url, method, param } = props.operation && props.operation.request || {}
  try {
    const form = { ...data, ...param }
    const res = await submitItem(url, method, form)
    if(res.code === 200) {
      emit('confirm', '')
      handleClose()
    }
  } catch (error){

  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.export-tips {
  margin: 0 5em 18px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}
:deep(.demo-form) {
  margin-right: 0;
}
</style>
