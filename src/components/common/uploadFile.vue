<template>
  <el-upload class="upload-demo" action :limit="limit"
             :file-list="fileList"
             :http-request="requestUpload"
             :on-exceed="onexceed"
             :before-upload="beforeUpload"
             :accept="itemData.accept || '.xls,.xlsx'">
    <el-button type="primary" :icon="itemData.icon || 'UploadFilled'">{{itemData.text || '上传'}}</el-button>
    <template #tip v-if="tipShow">
      <div class="el-upload__tip">
        {{props.accept}} 文件不能超过 500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/store/system.js'
const stare = useSystemStore()
const props = defineProps({
  tipShow: {
    type: [ String, Boolean],
    default: () => false
  },
  itemData: {
    type: Object,
    default: () => {}
  }
})
const limit = ref(1)
const fileList = ref([])
const request = ref({})

onMounted(() => {
  request.value = props.itemData.request
})
const requestUpload = (param) => {
  const formData = new FormData()
  if (request.value && request.value.param && request.value.param instanceof Object) {
    request.value.param
    Object.entries(request.value.param).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }
  formData.append('file', param.file)
  axios.post(request.value.url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: stare.getToken
    }
  }).then(res => {
    if (res.data.code === 200) {
      fileList.value = []
      ElMessage({ title: '成功', message: `上传文件成功`, type: 'success', placement: 'top-right' })
      this.$emit('headCallBack', res.data.data)
    } else {
      ElMessage({ title: '警告', message: res.data.msg, type: 'warning', placement: 'top-right' })
    }
  })
}

const beforeUpload = (file) => {
  fileList.value = []
  if (file.size / 1024 / 1024 > 5) {
    ElMessage({ title: '警告', message: `上传文件大小不能超过5M!`, type: 'warning', placement: 'top-right' })
    return false
  }
  var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
  const extension = testmsg === 'xlsx' || testmsg === 'xls'
  if (!extension) {
    ElMessage({ title: '警告', message: `上传文件只能是 xls、xlsx格式!`, type: 'warning', placement: 'top-right' })
  }
  if (file.raw) {
    const reader = new FileReader() // 读取文件内容
    reader.readAsText(file.raw, 'gb2312')
    reader.onload = function (e) {
      console.log(e.target.result)
    }
  }
  return extension
}
const onexceed = (files, fileList) => {
  ElMessage({ title: '警告', message: `当前限制上传 ${limit.value} 个文件`, type: 'warning', placement: 'top-right' })
}
</script>

<style scoped lang="scss"></style>
