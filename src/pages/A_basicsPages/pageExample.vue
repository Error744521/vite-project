<template>
  <div class="index-content-page">
    <div class="module_page">
      <searchModule v-model="state.searchModel" :groups="state.searchGroups" @search="handleSearch" @reset="handleReset"></searchModule>
      <div class="card module_card">
        <div class="class-flex">
          <div class="class-flex-left">
            <IndexTotal :data="state.totalData"></IndexTotal>
          </div>
          <div class="class-flex-right">
            <IndexTableOperation :operation="state.operation" @callback="handleCallback"></IndexTableOperation>
          </div>
          <div class="class-flex-right">
            <IndexTableScreen :scree-data="state.screeData" @callback="handleCallback"></IndexTableScreen>
          </div>
        </div>
        <IndexTable
          v-loading="loading"
          class="class-table"
          :table-data="tableData"
          :meta="state.meta"
          :columns="columns"
          :params="state.params"
          @callback="handleCallback"
        >
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
            <el-button type="primary" link>详情</el-button>
            <!-- @click="detailLook(row)" -->
            <el-popover trigger="hover" placement="top">
              <el-button type="primary" link size="small">转平台</el-button>
              <!-- @click="reverseItem(row.id)" -->
              <el-button type="primary" link size="small">异常</el-button>
              <!-- @click="setItemBrank(row.id, row.unusual_flag)" -->
              <el-button type="primary" link size="small">删除</el-button>
              <!-- @click="deleteItem(row.id)" -->
              <el-button type="primary" link size="small"></el-button>
              <!-- {{ row === 0 ? '收藏' : '已收藏' }} @click="setitemcollect(row.id, row.collect_flag)" -->
              <template #reference>
                <div class="class-more-font-style">更多>></div>
              </template>
            </el-popover>
          </template>
        </IndexTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import searchModule from '@views/Components/searchModule/index.vue'
import IndexTable from '@/components/index-table.vue'
import { submitItem } from '@/api/index.js'
const tableData = ref([])
const defaultSearchParams = { page: 1, pagesize: 15 }
const state = reactive({
  searchModel: {},
  searchParams: { ...defaultSearchParams },
  searchGroups: [
    { label: '', fields: ['company_name', 'credit_code', 'link_man', 'link_phone'] },
    { label: '风险信息', fields: ['industry_id', 'company_status', 'company_type_ids', 'time_type'] },
    {
      label: '筛选信息',
      fields: ['org_id', 'target_type', 'area_ids', 'create_at', 'time_period']
    },
    {
      label: '数据条件',
      fields: ['inclusion_mode', 'rang_flag', 'send_flag', 'supervision', 'live_auth_type', 'live_delivery_method']
    },
    { label: '主播类型', fields: ['live_user_cate'] },
    { label: '带货品类', fields: ['live_goods_cate'] }
  ],
  information: {
    company_name: '342',
    credit_code: '123',
    platform_id: 176460,
    takeout_category_id: [1],
    flag: '',
    category_id: [1, 3],
    is_trade: '',
    monitor_frequency_flag: 1,
    start_time: '2025-12-26',
    date_range: ['2025-12-12', '2025-12-26'],
    behavior_id: [],
    label_id: '',
    link_address: '',
    file_path: '',
    image_path: ''
  },
  loading: false,
  meta: {},
  params: {
    pagination: true, //是否带分页
    border: true, //是否带有纵向边框
    stripe: true, //是否为斑马纹 table
    fit: true, //列的宽度是否自撑开
    showHeader: true,
    highlightCurrentRow: true, //是否要高亮当前行
    showOverflowTooltip: false, //是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它们
    emptyText: '暂无数据',
    selection: true,
    showIndex: true,
    expand: false,
    operationWidth: 150
  },
  totalData: {
    total: 0,
    request: { url: '', methods: 'post', param: { dataType: 3 } },
    pageUrl: '/exceptionData?type=3'
  },
  operation: {
    Template: { url: '' },
    Importing: { url: '/v1/companies/company_import', methods: 'post', param: { dataType: 3 } },
    Export: { url: '', methods: 'post', param: { dataType: 3 } },
    Assignment: { url: '', methods: 'post', param: { dataType: 3 } },
    Dispatch: { url: '', methods: 'post', param: { dataType: 3 } },
    Delete: { url: '', methods: 'post', param: { dataType: 3 } },
    Marking: { url: '', methods: 'post', param: { dataType: 3 } },
    Unusual: { url: '', methods: 'post', param: { dataType: 3 } },
    NewData: { url: '', methods: 'post', param: { dataType: 3 } },
    Screenshot: { url: '', methods: 'post', param: { dataType: 3 } }
  },
  screeData: {
    sorting: {
      url: '',
      methods: 'post',
      list: [
        { label: '默认', value: '' },
        { label: '正序', value: 1 },
        { label: '倒序', value: -1 }
      ]
    },
    select: {
      url: '',
      methods: 'post',
      list: [
        { label: '默认', value: '' },
        { label: '载体数', value: 1 },
        { label: '处罚', value: 2 },
        { label: '投诉', value: 3 },
        { label: '风险', value: 4 },
        { label: '信用', value: 5 }
      ]
    }
  }
})

const loading = ref(false)
const columns = ref([
  { prop: 'website_name', label: '网站名称', width: 'auto', minWidth: '10%', showOverflowTooltip: true },
  {
    prop: 'website_url',
    type: 'link',
    label: '网站地址',
    className: 'rowEllipsis',
    width: 'auto',
    minWidth: '10%',
    showOverflowTooltip: true
  },
  { slot: 'flag', label: '经营性质', width: 'auto', minWidth: '10%', align: 'center' },
  { slot: 'label_names', label: '数据标签', width: 'auto', minWidth: '10%' },
  { prop: 'website_licence', label: '备案号', width: 'auto', minWidth: '10%' },
  { slot: 'company_name', label: '主体名称', width: 'auto', minWidth: '10%', showOverflowTooltip: false },
  {
    slot: 'certificate_show_type',
    label: '是否亮证',
    width: 'auto',
    minWidth: '10%',
    showOverflowTooltip: true,
    align: 'center'
  },
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
const handleCallback = (key, val) => {
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
.module_page {
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
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
