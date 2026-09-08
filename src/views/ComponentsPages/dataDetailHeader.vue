<script setup>
import { CopyDocument, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/store/system.js'
import { copyName } from '@/utils/tools.js'
import MarkingDialog from '@views/Operation/MarkingDialog.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:image', 'upload-success', 'marking-success'])
const systemStore = useSystemStore()
const currentImageUrl = ref('')
const markingVisible = ref(false)

const getValue = (...keys) => {
  const value = keys.map((key) => props.data?.[key]).find((item) => item !== undefined && item !== null && item !== '')
  return value || '--'
}

const companyName = computed(() => getValue('company_name'))
const splitLabels = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.label_name || item?.label || item?.name || item).filter(Boolean)
  }
  if (!value) return []
  return String(value).split(/[,，、\s]+/).filter(Boolean)
}
const labelList = computed(() => {
  return splitLabels(props.data?.label_names || props.data?.labels || props.data?.tags_arr)
})
const getLevelClass = (value) => {
  const level = String(value || '').trim().charAt(0).toUpperCase()
  return ['A', 'B', 'C', 'D', 'E'].includes(level) ? `is-level-${level.toLowerCase()}` : 'is-empty'
}
const infoList = computed(() => [
  { label: '企业状态', value: getValue('company_status_name', 'company_status') },
  { label: '法定代表人', value: getValue('legal_person') },
  { label: '管辖机构', value: getValue('org_name') },
  { label: '行业类型', value: getValue('industry_name') },
  { label: '注册资本', value: getValue('capital') },
  { label: '地址', value: getValue('company_address', 'address') }
])

const scoreList = computed(() => [
  {
    label: '信用分级',
    value: getValue('credit_level'),
    className: getLevelClass(getValue('credit_level'))
  },
  {
    label: '风险评估',
    value: getValue('risk_level'),
    className: getLevelClass(getValue('risk_level'))
  }
])
const markingOperation = computed(() => ({
  key: 'Marking',
  request: {
    url: '/v1/labels/edit',
    method: 'post',
    param: {
      target_id: props.data?.id || 0,
      target_type: 3
    }
  }
}))

const handleCopyCompanyName = () => {
  if (companyName.value === '--') return
  copyName(companyName.value)
}

const openMarkingDialog = () => {
  markingVisible.value = true
}

const handleMarkingConfirm = () => {
  markingVisible.value = false
  emit('marking-success')
}

const imageUrl = computed(() => {
  return currentImageUrl.value || getValue('image_path', 'logo', 'avatar', 'company_image')
})
const uploadHeaders = computed(() => ({
  Accept: 'application/json',
  Authorization: systemStore.getToken || ''
}))
const uploadData = computed(() => ({
  target_type: 3,
  target_id: props.data?.id || 0
}))

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片格式的文件')
    return false
  }
  return true
}

const handleImageSuccess = (response) => {
  const url = response?.data?.url || response?.data?.path || response?.data
  if (!url) {
    ElMessage.error(response?.msg || '图片上传失败')
    return
  }
  currentImageUrl.value = url
  emit('update:image', url)
  emit('upload-success', response)
  ElMessage.success('图片上传成功')
}

const handleImageError = () => {
  ElMessage.error('图片上传失败')
}

watch(() => props.data, () => {
  currentImageUrl.value = ''
})
</script>

<template>
  <div class="data-detail-header">
    <el-upload class="data-detail-header__upload" action="/v1/uploads/img" :headers="uploadHeaders"
      :data="uploadData"
      :show-file-list="false"
      :before-upload="beforeImageUpload"
      :on-success="handleImageSuccess"
      :on-error="handleImageError"
      accept=".jpeg,.png,.jpg,.webp"
    >
      <div class="data-detail-header__icon">
        <img v-if="imageUrl !== '--'" :src="imageUrl" alt="企业图片" />
        <span v-else>企</span>
        <div class="data-detail-header__upload-mask">
          <el-icon><UploadFilled /></el-icon><em>更换图片</em>
        </div>
      </div>
    </el-upload>
    <div class="data-detail-header__main">
      <div class="data-detail-header__title">
        <h3>{{ companyName }}</h3>
        <el-button class="data-detail-header__copy" :icon="CopyDocument" link type="primary" @click="handleCopyCompanyName" />
      </div>
      <div class="data-detail-header__labels">
        <template v-if="labelList.length > 0">
          <el-tag v-for="label in labelList" :key="label" class="data-detail-header__label-tag" type="primary" effect="light" size="small">
            {{ label }}
          </el-tag>
        </template>
        <el-button class="data-detail-header__marking" link type="primary" @click="openMarkingDialog">
          <svg-icon icon-class="gf-tags" />
        </el-button>
      </div>
      <div class="data-detail-header__info">
        <div v-for="item in infoList" :key="item.label" class="data-detail-header__info-item">
          <span class="data-detail-header__label">{{ item.label }}：</span>
          <span class="data-detail-header__value">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="data-detail-header__score">
      <div class="data-detail-header__score-list">
        <div v-for="item in scoreList" :key="item.label" :class="['data-detail-header__score-item', item.className]">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
    <MarkingDialog v-model:visible="markingVisible" :operation="markingOperation" @confirm="handleMarkingConfirm" />
  </div>
</template>

<style scoped lang="scss">
.data-detail-header {
  position: relative;
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) 180px;
  gap: 28px;
  min-height: 132px;
  padding: 24px;
  background-color: $white-light;
  border-radius: 4px;
  box-sizing: border-box;
  > * {
    align-self: stretch;
  }
}

.data-detail-header__upload {
  width: 112px;
  height: 100%;

  :deep(.el-upload) {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.data-detail-header__icon {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  font-size: 50px;
  font-weight: 600;
  background-color: #acd2fb;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  &:hover {
    .data-detail-header__upload-mask {
      opacity: 1;
    }
  }
}

.data-detail-header__upload-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: $white;
  font-size: 13px;
  background-color: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.2s ease;

  em {
    font-style: normal;
  }
}

.data-detail-header__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.data-detail-header__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;

  h3 {
    max-width: 520px;
    margin: 0;
    color: $black-dark;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.data-detail-header__copy {
  flex-shrink: 0;
  font-size: 15px;
}

.data-detail-header__labels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: -2px 0 12px;
}

.data-detail-header__label-tag {
  border: none;
  color: $mainPrimary;
  background-color: rgba($mainPrimary, 0.1);
}

.data-detail-header__marking {
  height: 22px;
  padding: 0;
  font-size: 13px;

  :deep(.svg-icon) {
    font-size: 13px;
  }
}

.data-detail-header__info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 48px;
  row-gap: 12px;
}

.data-detail-header__info-item {
  min-width: 0;
  color: $black-color;
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-detail-header__label {
  color: $black-color;
}

.data-detail-header__value {
  color: $black-dark;
}

.data-detail-header__score {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.data-detail-header__score-list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 34px;
  width: 100%;
}

.data-detail-header__score-item {
  min-width: 56px;
  text-align: center;
  color: $black-dark;

  strong {
    display: block;
    margin-bottom: 18px;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
  }

  span {
    font-size: 14px;
    line-height: 1;
  }

  strong,
  span {
    color: inherit;
  }

  &.is-level-a {
    color: $green-dark;
  }

  &.is-level-b {
    color: $cyan-light;
  }

  &.is-level-c {
    color: $yellow-dark;
  }

  &.is-level-d {
    color: $orange-light;
  }

  &.is-level-e {
    color: $mainDanger;
  }

  &.is-empty {
    color: $black-dark;
  }
}

</style>
