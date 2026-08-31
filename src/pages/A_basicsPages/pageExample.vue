<template>
<div class="index-content-page">
  <div class="page-header-sticky">
    <page-header :loading="state.loading" :activeValue="0" :visibleList="state.menuArray" @handleSelect="handleSubmit" />
  </div>
  <div class="module_card">
    <div class="card margin_bottom">
      <search-form keys="pageExample" v-model="state.searchParams" :groups="state.searchGroups" @search="handleSubmit" @reset="handleReset" />
    </div>
    <div class="card">
      <div class="class-flex">
        <div class="class-flex-left">
          <index-total :totalData="state.totalData" />
        </div>
        <div class="class-flex-right">
          <index-table-operation :operationTable="state.operationTable" @callback="handleSubmit" />
        </div>
        <div class="class-flex-right">
          <index-table-screen v-model="state.sortingParams" :screenTable="state.screenTable" @callback="handleSubmit" />
        </div>
      </div>
      <index-table class="class-table" v-loading="state.loading" :params="state.params" :columns="state.columns" :tableData="state.tableData" :meta="state.meta"  @callback="handleSubmit">
        <template #flag="{ row }">
          <span v-if="row.flag === '1'">非交易网站</span>
          <span v-else>交易网站</span>
        </template>
        <template #label_names="{ row }">
          <el-popover trigger="hover" placement="top" :disabled="row.label_names ? false : true">
            <p>{{ row.label_names }}</p>
            <template #reference>
              <div class="name-wrapper oneline">
                <Edit class="hover icon-size" @click="getlabelTab(row)" /> {{ row.label_names }}
              </div>
            </template>
          </el-popover>
        </template>
        <template #company_name="{ row }">
          <el-popover trigger="hover" placement="top" :disabled="row.company_name ? false : true">
            <p>{{ row.company_name }}</p>
            <p>{{ row.org_name }}</p>
            <p>{{ row.company_address }}</p>
            <template #reference>
              <div class="name-wrapper oneline">{{ row.company_name }}</div>
            </template>
          </el-popover>
        </template>
        <template #operation="{ row }">
          <el-button  type="primary" link >详情</el-button> <!-- @click="detailLook(row)" -->
          <el-popover trigger="hover" placement="top">
            <el-button  type="primary" link >转平台</el-button> <!-- @click="reverseItem(row.id)" -->
            <el-button  type="primary" link >异常</el-button> <!-- @click="setItemBrank(row.id, row.unusual_flag)" -->
            <el-button  type="primary" link >删除</el-button> <!-- @click="deleteItem(row.id)" -->
            <el-button type="primary" link ></el-button> <!-- {{ row === 0 ? '收藏' : '已收藏' }} @click="setitemcollect(row.id, row.collect_flag)" -->
            <template #reference>
              <el-button  type="primary" link >更多>></el-button>
            </template>
          </el-popover>
        </template>
      </index-table >
    </div>
  </div>
</div>
</template>

<script setup>
import { submitItem } from '@/api/index.js'
import SearchForm from '@views/Components/searchModule/index.vue'
import { useFormStore } from '@/store/formation.js'
const formStore = useFormStore()
const registerPageActions = inject('registerPageActions', null)
const route = useRoute()

const state = reactive({
  request: { url: '/v1/companies', method: 'get', param: { is_online: 1 } },
  menuArray: [
    { label: '在网主体库', value: '0', show: true, request: { url: '/v1/companies', method: 'get', param: { is_online: 1 } }},
    { label: '登记主体库', value: '1', show: true, request: { url: '/v1/companies', method: 'get', param: { is_online: '' } }},
    { label: '认领库', value: '2', show: true, request: { url: '/v1/companies/claims', method: 'get', param: {} }},
    { label: '不能确认主体', value: '3', show: true, request: { url: '/v1/takeouts', method: 'get', param: {} }}
  ],
  searchGroups: [
    { label: '', fields: ['company_name', 'credit_code', 'scope_name', 'company_address', 'label_name', 'inclusion_mode', 'updateDate']},
    { label: '筛选信息', fields: ['industry_id', 'org_id', 'company_status', 'capital', 'company_type_ids', 'platform_id']},
    { label: '风险信息', fields: ['punish_flag', 'complaint_flag', 'abnormal_flag', 'credit_level', 'risk_level']}
  ],
  totalData: {
    total: 0,
    show: true,
    goPage: { url: '/exceptionData?type=3', request: { url: '', method: 'post', param: { dataType: 3 } } },
  },
  operationTable: {
    Linking: { url: 'http://baidu.com' },
    Template: { url: '/v1/companies/down_template', method: 'post', param: { } },
    Importing: { url: '/v1/companies/company_import', method: 'post', param: { } },
    Export: { url: '/v1/companies/export', method: 'post', param: { dataType: 3 } },
    Assignment: { url: '/v1/assigns', method: 'post', param: { dataType: 3 } },
    Dispatch: { url: '/v1/assigns', method: 'post', param: { dataType: 3 } },
    Delete: { url: '/v1/companies', method: 'delete', param: { dataType: 3 } },
    Marking: { url: '/v1/labels/edit', method: 'post', param: { dataType: 3 } },
    Unusual: { url: '', method: 'post', param: { dataType: 3 } },
    NewData: { url: '/registerBodyEdit' },
    Screenshot: { url: '', method: 'post', param: { dataType: 3 } }
  },
  screenTable: {
    sorting: { request: { url: '', method: 'post', param: {} }, options: [{ label: '默认', value: '' }, { label: '正序', value: 1 }, { label: '倒序', value: -1 }]},
    select: { request: { url: '', method: 'post', param: {} }, options: [
        { label: '默认', value: '' },
        { label: '载体数', value: 1 },
        { label: '处罚', value: 2 },
        { label: '投诉', value: 3 },
        { label: '风险', value: 4 },
        { label: '信用', value: 5 }
      ]
    }
  },
  loading: false,
  params: {
    border: true,
    stripe: true,
    fit: true,
    showHeader: true,
    highlightCurrentRow: true,
    showOverflowTooltip: false,
    emptyText: '暂无数据',
    selection: true,
    showIndex: true,
    expand: false,
    operationWidth: 150
  },
  columns: [
    { prop: 'website_name', label: '网站名称', width: 'auto', minWidth: '10%', showOverflowTooltip: true },
    { prop: 'website_url', type: 'link', label: '网站地址', className: 'rowEllipsis', width: 'auto', minWidth: '10%', showOverflowTooltip: true },
    { slot: 'flag', label: '经营性质', width: 'auto', minWidth: '10%', align: 'center' },
    { slot: 'label_names', label: '数据标签', width: 'auto', minWidth: '10%' },
    { prop: 'website_licence', label: '备案号', width: 'auto', minWidth: '10%' },
    { slot: 'company_name', label: '主体名称', width: 'auto', minWidth: '10%', showOverflowTooltip: false },
    { slot: 'certificate_show_type', label: '是否亮证', width: 'auto', minWidth: '10%', showOverflowTooltip: true, align: 'center' },
    { slot: 'light_flag', label: '亮照/亮承诺', width: 'auto', minWidth: '10%', align: 'center' },
    { prop: 'updated_at', type: 'date', label: '更新时间', width: 'auto', minWidth: '10%', align: 'center' },
    { slot: 'operation', label: '操作', width: 'auto', minWidth: '12%', align: 'center', fixed: 'right' }
  ],
  tableData: [],
  meta: {
    pagination: true,
    total: 0,
    page: 1,
    pageSize: 15
  },
  searchParams: {}, // 搜索条件
  sortingParams: {}, // 排序条件
})
// 当前页面缓存标识，优先使用路由配置的 pageKey。
const pageKey = computed(() => String(route.meta?.pageKey || route.name))

const refreshCurrent = async () => {
  state.loading = true
  const request = state.request
  const searchParams = { ...state.searchParams, ...state.sortingParams, ...getPageParams, ...request.param }

  await submitItem(request.url, request.method, searchParams).then((res) => {
    state.loading = false
    if (res.code === 200) {
      state.tableData = res.data
      const meta = res.meta || res.data.meta
      state.meta.page = meta.current_page
      state.meta.pageSize = meta.per_page
      state.meta.total = meta.total || 0
      state.totalData.total = meta.total || 0
    } else {
      state.params.emptyText = res.msg || '请求数据失败！'
    }
  })
}
// 提取当前分页参数，用于缓存和请求参数组装。
const getPageParams = () => ({
  page: state.meta.page,
  pageSize: state.meta.pageSize
})

// 统一处理页面子组件回调：筛选、刷新、重置、翻页和页码大小变更。
const handleSubmit = (actionKey, params) => {
  const submitHandlers = {
    menu: () => {
      state.request = params
      handleReset()
    },
    screen: (params = {}) => { /* 排序 */
      state.sortingParams = { ...params }
      state.meta.page = 1
      refreshCurrent()
    },
    search: (params = {}) => { /* 搜索 */
      state.searchParams = { ...params }
      state.meta.page = 1
      refreshCurrent()
    },
    update: () => { /* 更新 */
      getList()
    },
    refresh: handleReset, /* 重置 */
    page: (page) => { /* 翻页 */
      state.meta.page = page
      refreshCurrent()
    },
    size: (pageSize) => { /* 页码 */
      state.meta.pageSize = pageSize
      state.meta.page = 1
      refreshCurrent()
    }
  }
  savePageQueryCache()
  submitHandlers[actionKey]?.(params)
}

// 缓存当前页面查询状态，二级页返回时可恢复筛选条件和分页。
const savePageQueryCache = () => {
  formStore.setPageQueryCache(pageKey.value, {
    searchParams: { ...state.searchParams },
    sortingParams: { ...state.sortingParams },
    meta: getPageParams()
  })
}

// 重置搜索条件、排序条件和分页，并清理当前页面缓存后重新请求列表。
const handleReset = () => {
  state.searchParams = {}
  state.sortingParams = {}
  state.meta.page = 1
  state.meta.pageSize = 15
  formStore.clearPageQueryCache(pageKey.value)
  refreshCurrent()
}


// 恢复缓存条件后重新请求列表，适用于详情页修改数据后返回列表。
const restoreAndFetch = () => {
  restorePageQueryCache()
  refreshCurrent()
}
// 恢复当前页面查询缓存，返回 true 表示命中缓存。
const restorePageQueryCache = () => {
  const cache = formStore.getPageQueryCache(pageKey.value)
  if (!cache) return false
  state.searchParams = { ...(cache.searchParams || {}) }
  state.sortingParams = { ...(cache.sortingParams || {}) }
  state.meta = { ...state.meta, ...(cache.meta || {}) }
  return true
}

// 根据导航意图处理列表状态：菜单进入重置，详情返回恢复，数据变更后刷新。
const handlePageIntent = (initial = false) => {
  const intent = formStore.getNavigationIntent(pageKey.value)
  const intentHandler = {
    menu: handleReset,
    resetRefresh: handleReset,
    detailUpdated: restoreAndFetch,
    refresh: refreshCurrent
  }
  if (intentHandler[intent]) {
    formStore.clearNavigationIntent(pageKey.value)
    intentHandler[intent]()
    return
  }

  if (initial) {
    restoreAndFetch()
  }
}

// 写入页面导航意图并立即执行对应动作。
const runPageIntent = (intent) => {
  formStore.setNavigationIntent(pageKey.value, intent)
  handlePageIntent()
}

// 注册当前列表页可被外部触发的动作，例如菜单点击和顶部刷新。
const registerCurrentPageActions = () => {
  registerPageActions?.({
    menu: () => runPageIntent('menu'),
    refresh: () => runPageIntent('refresh'),
    resetRefresh: () => runPageIntent('resetRefresh')
  })
}

// 组件失活或卸载时清空注册动作，避免旧页面继续响应外部操作。
const clearCurrentPageActions = () => {
  registerPageActions?.({})
}

onMounted(() => {
  registerCurrentPageActions()
  handlePageIntent(true)
})

onActivated(() => {
  registerCurrentPageActions()
  handlePageIntent()
})

onDeactivated(clearCurrentPageActions)
onUnmounted(clearCurrentPageActions)
</script>

<style scoped lang="scss">
.index-content-page {
  height: 100%;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
}
.page-header-sticky {
  position: sticky;
  top: 0;
  z-index: 20;
}
.module_card {
  .margin_bottom{
    margin-bottom: 10px;
  }
}
.class-table {
  flex: 1;
  min-height: 0;
}
.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px;
  background: #f0f9ff;
  border: 1px solid #d6ecff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1890ff;
  &:hover {
    background: #e6f7ff;
    border-color: #91d5ff;
  }
  .refresh-icon {
    width: 16px;
    height: 16px;
  }
  span {
    font-size: 14px;
  }
}
</style>
