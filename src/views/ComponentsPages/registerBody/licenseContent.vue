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

const activeTab = ref('')
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
const columns = [
  {
    prop: 'licence_name',
    label: '许可名称',
    minWidth: '160',
    showOverflowTooltip: true
  },
  {
    prop: 'licence_code',
    label: '许可证号',
    minWidth: '160',
    showOverflowTooltip: true
  },
  {
    prop: 'licence_scope',
    label: '许可内容',
    minWidth: '220',
    showOverflowTooltip: true
  },
  {
    prop: 'valid_date',
    label: '有效期',
    minWidth: '160',
    showOverflowTooltip: true
  },
  {
    prop: 'issue_org',
    label: '发证机关',
    minWidth: '160',
    showOverflowTooltip: true
  },
  {
    prop: 'status',
    label: '状态',
    minWidth: '100'
  }
]

const currentTab = async () => {
  if (!props.itemData.id || !activeTab.value) {
    tableData.value = []
    return
  }
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

watch([licenseTabs, () => props.itemData.id], ([tabs]) => {
  if (tabs.length === 0) {
    activeTab.value = ''
    tableData.value = []
    return
  }
  if (!tabs.some((item) => item.name === activeTab.value)) {
    activeTab.value = tabs[0].name
  }
  currentTab()
}, {
  immediate: true
})
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
      <el-tabs v-model="activeTab" :tab-position="'left'" @tab-change="currentTab" class="license-content__tabs">
        <el-tab-pane v-for="item in licenseTabs" :key="item.value" :name="item.name">
          <template #label><span>{{ item.name }}</span> <em>({{ item.value }})</em></template>
        </el-tab-pane>
      </el-tabs>
      <index-table class="license-content__table" :loading="tableLoading" :table-data="tableData" :columns="columns" :params="tableParams" :meta="tableMeta" />
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
  padding: 0 10px 18px;
}
.license-content__tabs{
  min-width: 200px;
  width: 300px;
  v-deep(.el-tabs__content){
    width: 0;
  }
}
.license-content__table {
  flex: 1;
  padding: 10px 0;
}
</style>
