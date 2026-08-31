<template>
  <el-upload
    :action="uploadUrl"
    :data="uploadData"
    :accept="field.accept || '.xls,.xlsx'"
    :limit="field.limit || 1"
    :disabled="field.disabled"
    :headers="uploadHeaders"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :file-list="fileList"
  >
    <el-button type="primary" :disabled="field.disabled">{{ field.text || '文件上传' }}</el-button>
    <template #tip v-if="field.tip">
      <div class="el-upload__tip">只能上传 {{ field.accept }} 文件</div>
    </template>
  </el-upload>
</template>

<script setup>
import { useSystemStore } from '@/store/system.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])
const systemStore = useSystemStore()

const uploadUrl = computed(() => props.field.request?.url || '/api/upload')
const uploadData = computed(() => props.field.request?.param || {})
const uploadHeaders = computed(() => ({
  Accept: 'application/json',
  Authorization: systemStore.getToken || ''
}))
const fileList = ref([])

const handleSuccess = (response, file) => {
  emit('update:modelValue', response?.data?.url || response?.data?.path || file.name)
}

const handleRemove = () => {
  emit('update:modelValue', '')
}

watch(() => props.modelValue, (value) => {
  fileList.value = value ? [{ name: value, url: value }] : []
}, { immediate: true })
</script>
