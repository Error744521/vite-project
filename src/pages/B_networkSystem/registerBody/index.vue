<template>
<div class="index-content-page">
  <el-affix target=".index-content-page" :offset="0">
    <page-header :type="1" :loading="loading" :list="state.menuArray" @callback="" />
  </el-affix>
  <search-form keys="B_networkSystem" v-model="state.searchModel" :groups="state.searchGroups" @search="handleSearch" @reset="handleReset" />
  <div class="card module_card">
    <div class="class-flex">
      <div class="class-flex-left">
        <index-total :totalData="state.totalData" />
      </div>
      <div class="class-flex-right">
        <index-table-operation :operationTable="state.operationTable" @callback="handleSubmit" />
      </div>
      <div class="class-flex-right">
        <index-table-screen :screeTable="state.screeTable" @callback="handleSubmit" />
      </div>
    </div>
    <index-table class="class-table" v-loading="loading" :tableData="tableData" :meta="state.meta" :columns="columns" :params="state.params" @callback="handleSubmit">
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
<!--  <div class="module_page">

  </div>-->
</div>
</template>

<script setup>
import { submitItem } from '@/api/index.js'
import SearchForm from '@views/Components/searchModule/index.vue'

const tableData = ref([])
const defaultSearchParams = { page: 1, pagesize: 15 }
const state = reactive({
  menuArray: [
    { label: '在网主体库', value: '1', show: true, url: '/v1/companies' },
    { label: '登记主体库', value: '2', show: true, url: '/v1/companies' },
    { label: '认领库', value: '3', show: true, url: '/v1/companies/claims' },
    { label: '不能确认主体', value: '4', show: true, url: '/v1/takeouts' }
  ],
  searchModel: { company_name: '342', credit_code: '123', label_name: 2,  inclusion_type: 1, targe_ids: [7], company_type_ids: [11,12] },
  searchParams: { ...defaultSearchParams },
  searchGroups: [
    {
      label: '',
      fields: ['company_name', 'credit_code', 'scope_name', 'company_address', 'label_name', 'inclusion_mode', 'updateDate']
    },
    {
      label: '筛选信息',
      fields: ['industry_id', 'org_id', 'company_status', 'capital', 'company_type_ids', 'platform_id']
    },
    {
      label: '风险信息',
      fields: ['punish_flag', 'complaint_flag', 'abnormal_flag', 'credit_level', 'risk_level']
    }
  ],
  totalData: {
    total: 0,
    show: true,
    goPage: { url: '/exceptionData?type=3', request: { url: '', methods: 'post', param: { dataType: 3 } } },
  },
  operationTable: {
    Linking: { url: 'http://baidu.com' },
    Template: { url: '/v1/companies/down_template', methods: 'post', param: { } },
    Importing: { url: '/v1/companies/company_import', methods: 'post', param: { } },
    Export: { url: '/v1/companies/export', methods: 'post', param: { dataType: 3 } },
    Assignment: { url: '', methods: 'post', param: { dataType: 3 } },
    Dispatch: { url: '', methods: 'post', param: { dataType: 3 } },
    Delete: { url: '', methods: 'post', param: { dataType: 3 } },
    Marking: { url: '', methods: 'post', param: { dataType: 3 } },
    Unusual: { url: '', methods: 'post', param: { dataType: 3 } },
    NewData: { url: '', methods: 'post', param: { dataType: 3 } },
    Screenshot: { url: '', methods: 'post', param: { dataType: 3 } }
  },
  screeTable: {
    sorting: { url: '', methods: 'post', list: [{ label: '默认', value: '' }, { label: '正序', value: 1 }, { label: '倒序', value: -1 }]},
    select: { url: '', methods: 'post', list: [
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
  meta: {
    pagination: true,
    total: 0,
    page: 1,
    pagesize: 15
  },
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
})

const loading = ref(false)
const columns = ref([
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
])

const getList = (param = state.searchParams, replace = false) => {
  state.searchParams = replace ? { ...param } : { ...state.searchParams, ...param }
  loading.value = true
  submitItem('/v1/websites', 'get', state.searchParams).then((res) => {
    loading.value = false
    if (res.code === 200) {
      tableData.value = res.data
      state.meta.page = res.meta.current_page
      state.meta.pageSize = res.meta.per_page
      state.meta.total = res.meta.total
      state.totalData.total = res.meta.total
    } else {
      state.params.emptyText = res.msg || '请求数据失败！'
    }
  })
}

const handleSearch = (params) => {
  getList({ ...params, page: 1 }, true)
}

const handleReset = () => {
  state.searchModel = {}
  state.searchParams = { ...defaultSearchParams }
  getList(state.searchParams, true)
}

const handleSubmit = (key, val) => {
  if (key === 'page' || key === 1) {
    state.meta.page = val
    getList({ page: val })
  }
  if (key === 'size') {
    state.meta.pageSize = val
    getList({ page: 1, pagesize: val })
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.index-content-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
}
.module_card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
