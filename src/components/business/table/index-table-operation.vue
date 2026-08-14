<template>
    <div v-if="operationList.length > 0" class="class-table-operation">
      <div v-for="item in operationList" :key="item.key">
        <p v-if="item.type === 'upload'" class="template_flag">
          <uploadFile :itemData="item" :tipShow="false" />
        </p>
        <el-button v-else class="template_flag" :type="item.buttonType || 'default'" plain :link="item.type === 'link'"
                   :color="item.color" :icon="item.icon" :loading="loadingKey === item.key" :disabled="Boolean(loadingKey)" @click="handleClick(item)">
          {{ item.text }}
        </el-button>
      </div>
    </div>
    <component :is="activeOperationComponent" v-if="activeOperationComponent" v-model:visible="dialogVisible" @confirm="handleDialogConfirm" />
</template>

<script setup>
import { ElMessage } from 'element-plus'
import OperationComponents from '@views/Operation'
import { submitItem } from '@/api/index.js'
import { downloadByUrl, goPage } from '@/utils/tools.js'
const props = defineProps({
  operationTable: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['callback'])
const dialogVisible = ref(false)
const activeOperation = ref(null)
const loadingKey = ref('')

const operationItems = [
  { key: 'Linking', text: '链接', type: 'link', color: '#409EFF', icon: '' },
  { key: 'Template', text: '下载模板', type: 'download', color: '#409EFF', icon: '' },
  { key: 'Importing', text: '导入', type: 'upload', color: '#409EFF', icon: 'UploadFilled', accept: '.xls,.xlsx', limit: 1 },
  { key: 'Export', text: '导出', type: 'dialog', color: '#909399', icon: 'DocumentCopy' },
  { key: 'NewData', text: '新增', type: 'router', color: '#15b48f', icon: 'DocumentAdd' },
  { key: 'Assignment', text: '指派', type: 'dialog', color: '#0db1f6', icon: 'Pointer' },
  { key: 'Dispatch', text: '分派', type: 'dialog', color: '#11b6b6', icon: 'Guide' },
  { key: 'Marking', text: '打标', type: 'dialog', color: '#76b21a', icon: 'CopyDocument' },
  { key: 'Unusual', text: '异常', type: 'dialog', color: '#E6A23C', icon: 'WarnTriangleFilled' },
  { key: 'Delete', text: '删除', type: 'request', buttonType: 'warning', color: '#F56C6C', icon: 'Delete' }
]

const handleClick = async (item) => {
  if (loadingKey.value) return
  if (item.type === 'link') {
    if (item.request?.url) {
      goPage(item.request.url)
    } else {
      ElMessage.warning('链接地址不存在')
    }
    return
  }
  if (item.type === 'dialog') {
    activeOperation.value = item
    dialogVisible.value = true
    return
  }
  if (item.type === 'router') {
    if (item.request?.url) {
      goPage(item.request.url)
      emit('callback', item.key, item.request, item)
    } else {
      ElMessage.warning('跳转地址不存在')
    }
    return
  }
  if (item.type === 'download') {
    loadingKey.value = item.key
    try {
      const res = await requestAction(item.request)
      const url = getDownloadUrl(res)
      if (url) {
        downloadByUrl(url, item.request?.name || item.request?.fileName)
        emit('callback', item.key, res, item)
      } else {
        ElMessage.warning('下载链接不存在')
      }
    } finally {
      loadingKey.value = ''
    }
    return
  }
  if (item.type === 'request') {
    loadingKey.value = item.key
    try {
      const res = await requestAction(item.request)
      emit('callback', item.key, res, item)
      if (item.refresh !== false) {
        emit('callback', 'refresh')
      }
    } finally {
      loadingKey.value = ''
    }
  }
}
const requestAction = (request = {}) => {
  const url = request.url
  const method = request.method || 'get'
  const param = request.param || {}
  if (!url) {
    ElMessage.warning('请求地址不存在')
    return Promise.resolve(null)
  }
  return submitItem(url, method, param)
}

const getDownloadUrl = (res) => {
  const data = res?.data
  if (typeof data === 'string') return data
  if (typeof data?.path === 'string') return data.path
  if (typeof data?.url === 'string') return data.url
  return ''
}

const operationList = computed(() => {
  return operationItems.reduce((list, item) => {
    const request = props.operationTable[item.key]
    if (request) {
      list.push({ ...item, ...request, request })
    }
    return list
  }, [])
})

const activeOperationComponent = computed(() => {
  if (!activeOperation.value) return null
  return OperationComponents[`${activeOperation.value.key}Dialog`] || null
})

const handleDialogConfirm = (data) => {
  if (activeOperation.value) {
    emit('callback', activeOperation.value.key, data, activeOperation.value)
  }

  handleDialogClose()
}

const handleDialogClose = () => {
  dialogVisible.value = false
  activeOperation.value = null
}
</script>

<style scoped lang="scss">
.class-table-operation {
  @include flexwrap(nowrap);
  p {
    margin-right: 10px;
  }
  .select_flag {
    margin-left: 10px;
  }
  .template_flag {
    margin-right: 10px;
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
