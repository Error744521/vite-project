<template>
  <div class="index-content-page">
    <el-affix target=".index-content-page" :offset="0">
      <page-header :type="1" :list="state.menuArray" />
    </el-affix>
    <div class="module_page">
      <search-form :keys="'registerBody'" :formData="state.formFields" @setCallback="handleSubmit" />
      <!--    <div class="card module_card">
      <div class="class-flex">
        <div class="class-flex-left">
          <index-total :data="state.totalData" />
        </div>
        <div class="class-flex-right">
          <index-table-operation :operation="state.operation" @callback="handleSubmit" />
        </div>
        <div class="class-flex-right">
          <index-table-screen :screeData="state.screeData" @callback="handleSubmit" />
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
          <el-button  type="primary" link >详情</el-button> &lt;!&ndash; @click="detailLook(row)" &ndash;&gt;
          <el-popover trigger="hover" placement="top">
            <el-button  type="primary" link size="small">转平台</el-button> &lt;!&ndash; @click="reverseItem(row.id)" &ndash;&gt;
            <el-button  type="primary" link size="small">异常</el-button> &lt;!&ndash; @click="setItemBrank(row.id, row.unusual_flag)" &ndash;&gt;
            <el-button  type="primary" link size="small">删除</el-button> &lt;!&ndash; @click="deleteItem(row.id)" &ndash;&gt;
            <el-button type="primary" link size="small"></el-button> &lt;!&ndash; {{ row === 0 ? '收藏' : '已收藏' }} @click="setitemcollect(row.id, row.collect_flag)" &ndash;&gt;
            <template #reference>
              <div class="class-more-font-style">更多>></div>
            </template>
          </el-popover>
        </template>
      </index-table >
    </div>-->
    </div>
  </div>
</template>

<script setup>
import {submitItem} from '@/api/index.js'
import {useFormStore} from '@/store/formation.js'
import SearchForm from '@views/Components/searchModule/index.vue'

const store = useFormStore()
const tableData = ref([])
const state = reactive({
  menuArray: [{label: '在网主体库', value: '1', show: true, url: '/v1/companies'}, {
    label: '登记主体库',
    value: '2',
    show: true,
    url: '/v1/companies'
  }, {label: '认领库', value: '3', show: true, url: '/v1/companies/claims'}, {
    label: '不能确认主体',
    value: '4',
    show: true,
    url: '/v1/takeouts'
  }],
  formFields: [{
    label: '',
    Options: {
      company_name: true,
      credit_code: true,
      scope_name: true,
      company_address: true,
      label_name: true,
      inclusion_mode: true,
      updateDate: true
    }
  }, {
    label: '筛选信息',
    Options: {
      industry_id: true,
      org_id: true,
      company_status: true,
      capital: true,
      company_type_ids: true,
      platform_id: true
    }
  }, {
    label: '风险信息',
    Options: {punish_flag: true, complaint_flag: true, abnormal_flag: true, credit_level: true, risk_level: true}
  }],
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
  params: {pagination: true, //是否带分页 border: true, //是否带有纵向边框 stripe: true, //是否为斑马纹 table fit: true, //列的宽度是否自撑开 showHeader: true, highlightCurrentRow: true, //是否要高亮当前行 showOverflowTooltip: false, //是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它们 emptyText: '暂无数据', selection: true, showIndex: true, expand: false, operationWidth: 150 }, totalData: { total: 0, request: { url: '', methods: 'post', param: { dataType: 3 } }, pageUrl: '/exceptionData?type=3' }, operation: { Template: { url: '' }, Importing: { url: '/v1/companies/company_import', methods: 'post', param: { dataType: 3 } }, Export: { url: '', methods: 'post', param: { dataType: 3 } }, Assignment: { url: '', methods: 'post', param: { dataType: 3 } }, Dispatch: { url: '', methods: 'post', param: { dataType: 3 } }, Delete: { url: '', methods: 'post', param: { dataType: 3 } }, Marking: { url: '', methods: 'post', param: { dataType: 3 } }, Unusual: { url: '', methods: 'post', param: { dataType: 3 } }, NewData: { url: '', methods: 'post', param: { dataType: 3 } }, Screenshot: { url: '', methods: 'post', param: { dataType: 3 } } }, screeData: { sorting: { url: '', methods: 'post', list: [ { label: '默认', value: '' }, { label: '正序', value: 1 }, { label: '倒序', value: -1 } ] }, select: { url: '', methods: 'post', list: [ { label: '默认', value: '' }, { label: '载体数', value: 1 }, { label: '处罚', value: 2 }, { label: '投诉', value: 3 }, { label: '风险', value: 4 }, { label: '信用', value: 5 } ] } } }) const loading = ref(false) const columns = ref([ { prop: 'website_name', label: '网站名称', width: 'auto', minWidth: '10%', showOverflowTooltip: true }, { prop: 'website_url', type: 'link', label: '网站地址', className: 'rowEllipsis', width: 'auto', minWidth: '10%', showOverflowTooltip: true }, { slot: 'flag', label: '经营性质', width: 'auto', minWidth: '10%', align: 'center' }, { slot: 'label_names', label: '数据标签', width: 'auto', minWidth: '10%' }, { prop: 'website_licence', label: '备案号', width: 'auto', minWidth: '10%' }, { slot: 'company_name', label: '主体名称', width: 'auto', minWidth: '10%', showOverflowTooltip: false }, { slot: 'certificate_show_type', label: '是否亮证', width: 'auto', minWidth: '10%', showOverflowTooltip: true, align: 'center' }, { slot: 'light_flag', label: '亮照/亮承诺', width: 'auto', minWidth: '10%', align: 'center' }, { prop: 'updated_at', type: 'date', label: '更新时间', width: 'auto', minWidth: '10%', align: 'center' }, { slot: 'operation', label: '操作', width: 'auto', minWidth: '12%', align: 'center', fixed: 'right' } ]) const getList = () => { const param = store.getSearchRuleForm || { page: 1 } loading.value = true submitItem('/v1/websites', 'get', param).then((res) => { loading.value = false if (res.code === 200) { tableData.value = res.data state.meta.page = res.meta.current_page state.meta.pageSize = res.meta.per_page state.meta.total = res.meta.total state.totalData.total = res.meta.total } else { state.params.emptyText = res.msg || '请求数据失败！' } }) } const handleSubmit = (key, val) => { if (key === 'page' || key === 1) { state.meta.page = val getList() } if (key === 'size') { state.meta.pageSize = val getList() } } onMounted(() => { getList() })
</script>

<style scoped lang="scss">
.module_page {
  display: block;
  height: calc(100% - 60px);
  overflow: auto;
  position: relative;
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
