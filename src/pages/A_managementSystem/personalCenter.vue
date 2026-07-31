<template>
  <div class="index-content-page">
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <div class="card itemContentHeader">
            <div class="HeaderContent">
              <div class="HeaderContent_img">
                <img :src="userInfo.avatar" alt="" />
              </div>
              <descriptionsDom :list="descriptionslist" :row="userInfo" :column="3" :border="false" :title="userInfo.name" @edit-password="editPassword" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content">
          <div class="card marginTop">
            <el-menu :default-active="handletype" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1">巡查记录</el-menu-item>
              <el-menu-item index="2">收藏记录</el-menu-item>
              <el-menu-item index="3">导出数据</el-menu-item>
            </el-menu>
            <div class="marginTop">
              <IndexTable :loading="loading" :table-data="tableData" :columns="currentColumns()" :params="tableParams" :meta="meta" @callback="handleTableCallback" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <PasswordDialog v-model:visible="dialogPasswordVisible" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/store/system.js'
import { submitItem } from '../../api/index'
import { subString } from '@/utils/publicEvents/tools.js'
import descriptionsDom from '@/components/common/descriptionsDom.vue'
import IndexTable from '@/components/index-table.vue'
import PasswordDialog from "@views/Operation/PasswordDialog.vue";


const store = useSystemStore()

const loading = ref(false)
const handletype = ref('1')
const tableData = ref([])
const userInfo = ref({})
const descriptionslist = ref([
  { label: '所属机构', prop: 'org_name' },
  { label: '角色权限', prop: 'sysname' },
  { label: '系统数', prop: 'slug_list', formatter: (row) => row.slug_list?.length || 0 },
  { label: '所属部门', prop: 'dept_name' },
  { label: '所属区域', prop: 'province', formatter: (row) => {
    const parts = [row.province?.name]
    if (row.city?.name) parts.push(row.city.name)
    if (row.county?.name) parts.push(row.county.name)
    return parts.join(' ') || '--'
  }},
  { label: '修改密码', prop: 'edit_password', html: true, formatter: () => {
    return '<span style="color: #409eff;cursor: pointer">修改</span>'
  }}
])

const columns1 = ref([
  { prop: 'target_name', label: '数据名称', showOverflowTooltip: true },
  { prop: 'target_type_name', label: '数据类型', align: 'center', showOverflowTooltip: true },
  { prop: 'company_name', label: '企业名称', showOverflowTooltip: true },
  { prop: 'user_org', label: '所属机构', align: 'center', showOverflowTooltip: true },
  { prop: 'rule_content', label: '巡查结果', align: 'center', showOverflowTooltip: true },
  { prop: 'created_at', label: '巡查时间', align: 'center', showOverflowTooltip: true }
])

const columns2 = ref([
  { prop: 'target_name', label: '数据名称', showOverflowTooltip: true },
  { prop: 'target_type', label: '数据类型', align: 'center', showOverflowTooltip: true,
    formatter: (row) => row.target_type?.name || '' },
  { prop: 'company_name', label: '企业名称', showOverflowTooltip: true },
  { prop: 'org_name', label: '所属机构', showOverflowTooltip: true },
  { prop: 'created_at', label: '收藏时间', align: 'center', showOverflowTooltip: true }
])

const columns3 = ref([
  { prop: 'download_url', label: '下载链接', showOverflowTooltip: true, type: 'link' },
  { prop: 'status', label: '下载状态', align: 'center', showOverflowTooltip: true,
    type: 'tag', tagMap: [
      { value: 1, label: '完成', type: 'success' },
      { value: 2, label: '失败', type: 'danger' },
      { value: 3, label: '等待中', type: 'warning' }
    ]},
  { prop: 'data_type', label: '数据类型', align: 'center' },
  { prop: 'org_name', label: '所属机构', align: 'center', showOverflowTooltip: true },
  { prop: 'created_at', label: '导出时间', align: 'center', showOverflowTooltip: true }
])

const tableParams = ref({
  showHeader: true,
  border: false,
  stripe: true,
  highlightCurrentRow: false,
  emptyText: '暂无数据',
  showIndex: true,
  pagination: true
})

const meta = ref({
  page: 1,
  pageSize: 15,
  total: 0
})

const getlist = async (page) => {
  let url = `/v1/judges?page=${page}`
  let type = 'get'
  let param = {}

  if (handletype.value === '2') {
    type = 'post'
    url = '/v1/users/my_collect'
    param = { page: page }
  }
  if (handletype.value === '3') {
    type = 'get'
    url = `/v1/exporttasks?page=${page}&tab_type=-1`
    param = { page: page }
  }

  loading.value = true
  try {
    const res = await submitItem(url, type, param)
    if (res.code === 200) {
      res.data.map((item, index) => {
        item.created_at = subString(item.created_at, 0, 10)
      })
      tableData.value = res.data
      meta.value.total = res.meta.total
      meta.value.page = res.meta.current_page
    } else {
      ElMessage({ message: res.msg, type: 'warning' })
    }
  } catch (error) {
    ElMessage({ message: '请求失败', type: 'error' })
  } finally {
    loading.value = false
  }
}

const currentColumns = () => {
  switch (handletype.value) {
    case '1':
      return columns1.value
    case '2':
      return columns2.value
    case '3':
      return columns3.value
    default:
      return columns1.value
  }
}

const handleTableCallback = (type, value) => {
  if (type === 'page') {
    getlist(value)
  } else if (type === 'size') {
    meta.value.pageSize = value
    getlist(1)
  }
}

const handleSelect = (key) => {
  handletype.value = key
  getlist(1)
}

const dialogPasswordVisible = ref(false)
const editPassword = () => {
  dialogPasswordVisible.value = true
}

onMounted(() => {
  userInfo.value = store.getUserInfo || {}
  getlist(1)
})
</script>

<style scoped lang="scss">
.itemContentHeader {
  padding: 20px;
  .HeaderContent {
    display: flex;
    .HeaderContent_img {
      height: 100px;
      max-width: 100px;
      width: 100px;
      background-color: #6dc6f2;
      border-radius: 100%;
      border: 1px solid #6dc6f2;
      img {
        width: 100px;
        height: 100px;
        border-radius: 100%;
      }
    }
    div:nth-child(2) {
      margin-left: 25px;
      margin-top: 10px;
      flex: 1;
    }
  }
}
.card {
  padding: 20px;
}
.marginTop {
  margin-top: 15px;
}
</style>
