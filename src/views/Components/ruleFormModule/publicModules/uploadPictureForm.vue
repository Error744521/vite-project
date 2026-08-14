<template>
  <el-upload
    :action="uploadUrl"
    :data="uploadData"
    :accept="field.accept || '.jpeg,.png,.jpg'"
    :limit="field.limit || 1"
    :multiple="field.multiple || false"
    :disabled="field.disabled"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :file-list="fileList"
    list-type="picture-card"
  >
    <el-icon class="el-icon-plus">
      <Plus />
    </el-icon>
    <template #tip v-if="field.tip">
      <div class="el-upload__tip">只能上传 {{ field.accept }} 图片</div>
    </template>
  </el-upload>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  field: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const uploadUrl = computed(() => props.field.request?.url || '/api/upload')
const uploadData = computed(() => props.field.request?.param || {})
const fileList = ref([])

const handleSuccess = (response, file) => {
  const url = response?.data?.url || response?.data?.path || URL.createObjectURL(file.raw)
  emit('update:modelValue', [...props.modelValue, url])
}

const handleRemove = (file) => {
  const nextValue = props.modelValue.filter((url) => url !== file.url)
  emit('update:modelValue', nextValue)
}

watch(() => props.modelValue, (value) => {
  fileList.value = (value || []).map((url) => ({ name: url, url }))
}, { immediate: true })
</script>
