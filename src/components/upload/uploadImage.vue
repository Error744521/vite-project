<template>
  <div class="upload-image-wrapper">
    <el-upload class="upload-image" :action="''" :multiple="multiple" :limit="limit" :file-list="fileList" :http-request="handleUpload" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-remove="handleRemove" :accept="accept" :disabled="disabled">
      <div class="upload-btn" v-if="fileList.length < limit">
        <el-icon :size="24"><Plus /></el-icon>
        <span>{{ uploadText }}</span>
      </div>
    </el-upload>

    <div class="preview-list" v-if="fileList.length > 0">
      <div v-for="file in fileList" :key="file.uid" class="preview-item">
        <img :src="file.url || file.preview" :alt="file.name" class="preview-image" />
        <div class="preview-mask">
          <span class="preview-name">{{ file.name }}</span>
          <div class="preview-actions">
            <el-icon class="action-icon zoom" @click.stop="previewImage(file)" title="预览">
              <ZoomIn />
            </el-icon>
            <el-icon class="action-icon delete" @click.stop="handleRemove(file, fileList)" title="删除">
              <Delete />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <el-image-viewer v-if="previewVisible" :url-list="previewUrlList" :initial-index="previewIndex" @close="previewVisible = false"/>
  </div>
</template>

<script setup>
import { ElMessage, ElImageViewer } from 'element-plus'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'
import { useSystemStore } from '@/store/system.js'

const systemStore = useSystemStore()
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 9
  },
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/gif,image/webp,image/bmp'
  },
  maxSize: {
    type: Number,
    default: 5
  },
  uploadUrl: {
    type: String,
    default: '/api/upload/image'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  uploadText: {
    type: String,
    default: '点击上传'
  },
  withCredentials: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'error', 'remove', 'beforeUpload'])

const fileList = ref([])
const previewVisible = ref(false)
const previewIndex = ref(0)

const previewUrlList = computed(() => {
  return fileList.value.map(file => file.url || file.preview)
})

watch(() => props.modelValue, (val) => {
  if (val && val.length > 0) {
    fileList.value = val.map(item => ({
      uid: item.uid || Date.now() + Math.random(),
      name: item.name || '',
      url: item.url || item,
      status: 'success'
    }))
  }
}, { immediate: true, deep: true })

const beforeUpload = (file) => {
  const isImage = props.accept.includes(file.type)
  if (!isImage) {
    ElMessage.error('请上传图片格式的文件')
    return false
  }

  const isLtSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLtSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  emit('beforeUpload', file)
  return true
}

const handleUpload = async (param) => {
  const formData = new FormData()
  formData.append('file', param.file)
  try {
    const response = await fetch(props.uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': systemStore.getToken
      },
      body: formData,
      credentials: props.withCredentials ? 'include' : 'omit'
    })
    const result = await response.json()
    if (result.code === 200) {
      const fileItem = {
        uid: param.file.uid,
        name: param.file.name,
        url: result.data.url,
        status: 'success',
        response: result.data
      }
      fileList.value.push(fileItem)
      emit('update:modelValue', fileList.value)
      emit('success', result.data)
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(result.msg || '上传失败')
      emit('error', result)
    }
  } catch (error) {
    ElMessage.error('上传失败，请重试')
    emit('error', error)
  }
}

const handleRemove = (file, list) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emit('update:modelValue', fileList.value)
    emit('remove', file)
  }
}

const handleExceed = (files, list) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

const previewImage = (file) => {
  previewIndex.value = fileList.value.findIndex(item => item.uid === file.uid)
  previewVisible.value = true
}
</script>

<style scoped lang="scss">
.upload-image-wrapper {
  .upload-image {
    display: inline-block;
  }

  .upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafafa;

    &:hover {
      border-color: var(--el-color-primary);
      background: #f0f5ff;
    }

    span {
      margin-top: 8px;
      font-size: 14px;
      color: #999;
    }
  }

  .preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
  }

  .preview-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-mask {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;

      .preview-name {
        display: block;
        font-size: 12px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .preview-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;

        .action-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;

          &.zoom {
            background: rgba(255, 255, 255, 0.8);
            color: #666;
          }

          &.delete {
            background: #ff4d4f;
            color: #fff;
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    &:hover .preview-mask {
      opacity: 1;
    }
  }
}
</style>
