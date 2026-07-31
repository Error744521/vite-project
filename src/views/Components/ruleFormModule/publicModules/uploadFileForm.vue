<template>
  <el-upload
    :model-value="modelValue"
    :action="uploadUrl"
    :accept="attributes.accept || '.xls,.xlsx'"
    :limit="attributes.limit || 1"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :file-list="fileList"
  >
    <el-button type="primary">{{ attributes.text || '文件上传' }}</el-button>
    <template #tip v-if="attributes.tip">
      <div class="el-upload__tip">只能上传 {{ attributes.accept }} 文件</div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const uploadUrl = computed(() => props.attributes.request?.url || '/api/upload')
const fileList = ref([])

const handleSuccess = (response, file) => {
  emit('update:modelValue', response.data?.url || file.name)
}

const handleRemove = () => {
  emit('update:modelValue', '')
}

watch(() => props.modelValue, (val) => {
  if (val) {
    fileList.value = [{ name: val, url: val }]
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
</style>
