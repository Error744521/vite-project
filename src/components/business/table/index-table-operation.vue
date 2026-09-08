<template>
    <div v-if="operationList.length > 0" class="class-table-operation">
      <div v-for="item in operationList" :key="item.key">
        <p v-if="item.type === 'upload'" :class="['template_flag', `operation-${item.key}`]">
          <uploadFile :itemData="item" :tipShow="false" />
        </p>
        <el-button v-else :class="['template_flag', `operation-${item.key}`]" :type="item.buttonType || 'default'" plain :link="item.type === 'link'"
                   :icon="item.icon" :loading="loadingKey === item.key" :disabled="Boolean(loadingKey)" @click="handleClick(item)">
          {{ item.text }}
        </el-button>
      </div>
    </div>
    <component :is="activeOperationComponent" v-if="activeOperationComponent" v-model:visible="dialogVisible" :operation="activeOperation" @confirm="handleDialogConfirm" />
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import OperationComponents from '@views/Operation'
import { submitItem } from '@/api/index.js'
import { downloadByUrl, goPage } from '@/utils/tools.js'
import { operationItems } from './operationConfig.js'
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
const router = useRouter()

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
      router.push(item.request.url)
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
    const contains = ['Delete']
    try {
      const res = await requestAction(item.request)
      if (res.code === 200) {
        if (contains.includes(item.key)) {
          emit('callback', 'upload', item.key)
        }
      } else {
        ElMessage.warning(res.msg)
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
      list.push({ ...item, request })
    }
    return list
  }, [])
})

const activeOperationComponent = computed(() => {
  if (!activeOperation.value) return null
  return OperationComponents[`${activeOperation.value.key}Dialog`] || null
})

const handleDialogConfirm = (data) => {
  const contains = ['Assignment', 'Dispatch', 'Unusual']
  const key = activeOperation.value?.key || ''
  if (contains.includes(key)) {
    emit('callback', 'refresh', key)
  } else if (key === 'Marking'){
    emit('callback', 'upload', key)
  } else if (key === 'Importing') {
    return
  }
  handleDialogClose()
}

const handleDialogClose = () => {
  dialogVisible.value = false
  activeOperation.value = null
}
</script>

<style scoped lang="scss">
@mixin operation-button-theme($color) {
  --el-button-text-color: #{$color};
  --el-button-border-color: #{rgba($color, 0.5)};
  --el-button-bg-color: #{rgba($color, 0.1)};
  --el-button-hover-text-color: #{$white};
  --el-button-hover-border-color: #{$color};
  --el-button-hover-bg-color: #{$color};
  --el-button-active-text-color: #{$white};
  --el-button-active-border-color: #{$color};
  --el-button-active-bg-color: #{$color};
  --el-button-disabled-text-color: #{$color};
  --el-button-disabled-border-color: #{rgba($color, 0.4)};
  --el-button-disabled-bg-color: transparent;
}

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
  .operation-Linking,
  .operation-Template,
  .operation-Importing {
    @include operation-button-theme($mainPrimary);
  }
  .operation-Export {
    @include operation-button-theme($mainInfo);
  }
  .operation-NewData,
  .operation-Marking {
    @include operation-button-theme($green-dark);
  }
  .operation-Assignment {
    @include operation-button-theme($cyan-light);
  }
  .operation-Dispatch {
    @include operation-button-theme($cyan-dark);
  }
  .operation-Unusual {
    @include operation-button-theme($mainWarning);
  }
  .operation-Delete {
    @include operation-button-theme($mainDanger);
  }
}
</style>
