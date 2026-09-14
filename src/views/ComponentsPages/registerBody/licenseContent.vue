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
const emit = defineEmits(['edit', 'delete'])

const activeTab = ref(0)
const tableLoading = ref(false)
const licenseTabs = computed(() => props.itemData.licence_nums || [])
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
  ],
  1: [
    {prop: 'licence_name', label: '名称', showOverflowTooltip: true},
    {prop: 'licence_code', label: '编号', showOverflowTooltip: true},
    {prop: 'licence_scope', label: '经营范围', showOverflowTooltip: true},
    {prop: 'issue_org', label: '发证机关', showOverflowTooltip: true},
    {prop: 'data_source', label: '来源', showOverflowTooltip: true},
    {prop: 'issue_date', label: '发证日期', showOverflowTooltip: true},
    {prop: 'valid_date', label: '有效期限', showOverflowTooltip: true},
    operationColumn
  ],
  2: [
    {prop: 'licence_name', label: '许可名称', showOverflowTooltip: true},
    {prop: 'licence_code', label: '许可证号', showOverflowTooltip: true},
    {prop: 'licence_scope', label: '许可内容', showOverflowTooltip: true},
    {prop: 'valid_date', label: '有效期', showOverflowTooltip: true},
    {prop: 'issue_org', label: '发证机关', showOverflowTooltip: true},
    {prop: 'status', label: '状态'},
    operationColumn
  ],
  3: [
    {prop: 'licence_name', label: '名称', showOverflowTooltip: true},
    {prop: 'licence_code', label: '编号', showOverflowTooltip: true},
    {prop: 'product_name', label: '产品名称', showOverflowTooltip: true},
    {prop: 'approval_date', label: '批准日期', showOverflowTooltip: true},
    {prop: 'data_source', label: '来源', showOverflowTooltip: true},
    {prop: 'valid_date', label: '有效期至', showOverflowTooltip: true},
    operationColumn
  ]
}

const columns = computed(() => columnMap[activeTab.value] || columnMap[0])

const currentTab = async (val) => {
  if (!props.itemData.id || val === undefined || val === null) {
    tableData.value = []
    return
  }
  activeTab.value = val
  tableLoading.value = true
  try {
    const res = await submitItem('/v1/company/licencelist', 'get', {
      company_id: props.itemData.id,
      licence_category: activeTab.value
    }, { silent: true })
    tableData.value = Number(res.code) === 200 && Array.isArray(res.data) ? res.data : []
  } finally {
    tableLoading.value = false
  }
}

const handleAction = () => {

}

const handleEdit = (row) => {
  emit('edit', { row, activeTab: activeTab.value })
}

const handleDelete = (row) => {
  emit('delete', { row, activeTab: activeTab.value })
}
</script>

<template>
  <section class="license-content">
    <div class="license-content__header">
      <h3>许可信息</h3>
      <div class="license-content__actions">
        <el-button link type="primary" @click="handleAction"><i class="iconfont iconicon-import"></i> 新增 </el-button>
      </div>
    </div>
    <div class="class-flex">
      <ul class="license-content__tabs">
        <li v-for="(item, index) in licenseTabs" :key="index" @click="currentTab(index)" :class="[activeTab === index ? 'active' : '' ]">
          <span>{{ item.name }}</span> <em>({{ item.value }})</em>
        </li>
      </ul>
      <index-table class="license-content__table" :loading="tableLoading" :table-data="tableData" :columns="columns" :params="tableParams" :meta="tableMeta">
        <template #operation="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
