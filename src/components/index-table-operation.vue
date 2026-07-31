<template>
  <div class="class-table-operation">
    <div v-for="(item, index) in selectlist" :key="index">
      <p v-if="item.type === 'link'" class="template_flag">
        <el-link type="primary" underline="never" :href="item.request.url">{{ item.text }}</el-link>
      </p>
      <p v-if="item.type === 'upload'" class="template_flag">
        <uploadFile :itemData="item"></uploadFile>
      </p>
      <p v-if="['', 'default'].includes(item.type)">
        <el-button :type="item.type" plain @click="btnClick(item.request)" :color="item.color" :icon="item.icon">{{
          item.text
        }}</el-button>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  operation: {
    type: Object, default: () => {
    }
  }
})
const selectlist = ref([])
const btnClick = (request) => {
  const array = ['Assignment', 'Dispatch', 'Delete', 'Marking', 'Unusual'] // 实现截屏功能
  if (request && request.url === '') { }
}
const allRenderingData = shallowRef([
    /* { key: 'Template', text: '下载模板', type: 'link', color: '#409EFF', icon: '', request: { url: '', methods: 'post', param: { dataType: 3 } } } */
  { key: 'Template', text: '下载模板', type: 'link', color: '#409EFF', icon: '' },
  { key: 'Importing', text: '导入', type: 'upload', color: '#409EFF', icon: 'UploadFilled', accept: '.xls,.xlsx', limit: 1 },
  { key: 'Export', text: '导出', type: 'default', color: '#909399', icon: 'DocumentCopy' },
  { key: 'NewData', text: '新增', type: 'default', color: '#15b48f', icon: 'DocumentAdd' },
  { key: 'Assignment', text: '指派', type: 'default', color: '#0db1f6', icon: 'Pointer' },
  { key: 'Dispatch', text: '分派', type: 'default', color: '#11b6b6', icon: 'Guide' },
  { key: 'Delete', text: '删除', type: 'default', color: '#F56C6C', icon: 'Delete' },
  { key: 'Marking', text: '打标', type: 'default', color: '#76b21a', icon: 'CopyDocument' },
  { key: 'Unusual', text: '异常', type: 'default', color: '#E6A23C', icon: 'WarnTriangleFilled' }
])
onMounted(() => {
  selectlist.value = allRenderingData.value.map((item) => {
    if (props.operation && props.operation[item.key]) {
      item.request = props.operation[item.key]
      return item
    }
  })
})
</script>

<style scoped lang="scss">
.class-table-operation {
  @include flexwrap(nowap);
  p {
    margin-right: 10px;
  }
  .select_flag {
    margin-left: 10px;
  }
  p.template_flag {
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
