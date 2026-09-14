<script setup>
import IndexTable from '@/components/business/table/index-table.vue'
import { submitItem } from '@/api/index.js'

const props = defineProps({
  type: {
    type: [ Number, String ],
    default: 0
  },
  itemData: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['detail'])

const activeTab = ref('')
const tableLoading = ref(false)
const licenseTabOptions = [
  { type: '0', name: '平台', url: '/v1/platformss/list' },
  { type: '1', name: '网站', url: '/v1/websites/list' },
  { type: '2', name: '网店', url: '/v1/shops/list' },
  { type: '3', name: 'App', url: '/v1/apps/list' },
  { type: '4', name: '小程序', url: '/v1/wechatapps/list' },
  { type: '5', name: '公众号', url: '/v1/wechats/list' },
  { type: '6', name: '主播', url: '/v1/liveusers/list' },
  { type: '7', name: '本地生活', url: '/v1/takeouts/list' },
  { type: '9', name: '微博', url: '/v1/weibos/list' }
]
const licenseTabs = computed(() => {
  const countMap = new Map((props.itemData.zscq_nums || []).map((item) => [item.name, item.value]))
  return licenseTabOptions.map((item) => ({
    ...item,
    value: countMap.get(item.name) ?? 0
  }))
})
const tableParams = {
  border: true,
  stripe: false,
  selection: false,
  showIndex: true,
  showHeader: true,
  highlightCurrentRow: false,
  showOverflowTooltip: true,
  emptyText: '暂无数据'
}
const tableMeta = {
  pagination: false,
  page: 1,
  pageSize: 10,
  total: 0
}
const tableData = ref([])
const operationColumn = {
  slot: 'operation',
  prop: 'operation',
  label: '操作',
  width: 120,
  align: 'center',
  fixed: 'right'
}
const columnMap = {
  0: [
    {prop: 'licence_name', label: '许可名称', showOverflowTooltip: true},
    {prop: 'licence_code', label: '许可证号', showOverflowTooltip: true},
    {prop: 'licence_scope', label: '许可内容', showOverflowTooltip: true},
    {prop: 'valid_date', label: '有效期', showOverflowTooltip: true},
    {prop: 'issue_org', label: '发证机关', showOverflowTooltip: true},
    {prop: 'status', label: '状态'},
    operationColumn
  ]
}

const columns = computed(() => columnMap[activeTab.value] || columnMap[0])

const currentTab = async (tab) => {
  if (!props.itemData.id || !tab?.url) {
    tableData.value = []
    return
  }
  activeTab.value = String(tab.type)
  tableLoading.value = true
  try {
    const res = await submitItem(tab.url.trim(), tab.restful || 'post', {
      company_id: props.itemData.id
    }, { silent: true })
    tableData.value = Number(res.code) === 200 && Array.isArray(res.data) ? res.data : []
  } finally {
    tableLoading.value = false
  }
}

watch([() => props.itemData.id, licenseTabs], ([companyId, tabs]) => {
  if (!companyId || tabs.length === 0) {
    activeTab.value = ''
    tableData.value = []
    return
  }
  const current = tabs.find((item) => String(item.type) === activeTab.value) || tabs[0]
  currentTab(current)
}, { immediate: true })

const handleAction = () => {

}

const handleDetail = (row) => {
  emit('detail', { row, activeTab: activeTab.value })
}
</script>

<template>
  <section class="license-content">
    <div class="license-content__header">
      <h3>网络载体</h3>
    </div>
    <div class="class-flex">
      <ul class="license-content__tabs">
        <li v-for="item in licenseTabs" :key="item.type" :class="{ active: activeTab === String(item.type) }" @click="currentTab(item)">
          <span>{{ item.name }}</span> <em>({{ item.value }})</em>
        </li>
      </ul>
      <index-table class="license-content__table" :loading="tableLoading" :table-data="tableData" :columns="columns" :params="tableParams" :meta="tableMeta">
        <template #operation="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
        </template>
      </index-table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.license-content__header {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    color: $black-dark;
    font-size: 16px;
    font-weight: 500;
  }
  button {
    font-size: 14px;
    .iconfont {
      margin: 0 5px 0 0;
      position: relative;
      top: 2px;
    }
  }
}
.license-content {
  margin: 0 10px;
  padding: 0 10px 18px;
  background: $white;
}
.license-content__tabs{
  min-width: 140px;
  width: auto;
  margin-right: 20px;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: $white-shallow;
  &:after{
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 4px;
    height: 100%;
    background-color: var(--el-border-color-light);
    z-index: var(--el-index-normal);
  }
  li{
    height: 36px;
    line-height: 36px;
    text-align: right;
    padding: 0 25px;
    margin: 5px 0;
    width: stretch;
    color: $black-color;
    overflow: hidden;
    border-right: 4px solid var(--el-border-color-light);
    span{
      font-size: 15px;
      display: inline-block;
    }
    em{
      letter-spacing: 2px;
      font-size: 14px;
    }
  }
  li.active, li:hover{
    color: $blue-dark;
    cursor: pointer;
    z-index: 10;
  }
  li.active{
    border-right: 3px solid $blue-dark;
  }
}
.license-content__table {
  flex: 1;
  padding: 10px 0;
  width: 100%;
  overflow: hidden;
}
</style>
