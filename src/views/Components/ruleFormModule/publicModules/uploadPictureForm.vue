<template>
  <el-upload
    :model-value="modelValue"
    :action="uploadUrl"
    :accept="attributes.accept || '.jpeg,.png,.jpg'"
    :limit="attributes.limit || 1"
    :multiple="attributes.multiple || false"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :file-list="fileList"
    list-type="picture-card"
  >
    <el-icon class="el-icon-plus" />
    <template #tip v-if="attributes.tip">
      <div class="el-upload__tip">只能上传 {{ attributes.accept }} 图片</div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  attributes: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const uploadUrl = computed(() => props.attributes.request?.url || '/api/upload')
const fileList = ref([])

const handleSuccess = (response, file) => {
  const url = response.data?.url || URL.createObjectURL(file.raw)
  emit('update:modelValue', [...props.modelValue, url])
}

const handleRemove = (file) => {
  const newList = props.modelValue.filter(url => url !== file.url)
  emit('update:modelValue', newList)
}

watch(() => props.modelValue, (val) => {
  fileList.value = (val || []).map(url => ({ url }))
}, { immediate: true })
</script>

<style scoped lang="scss">
</style>
