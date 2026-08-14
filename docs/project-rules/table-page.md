# Table Page Rules

## 目标

表格页面统一维护搜索、分页、统计、操作栏和表格参数，避免每个页面重复发散写法。

## 页面结构

推荐结构：

```vue
<div class="module_page">
  <search-form
    v-model="state.searchModel"
    :groups="state.searchGroups"
    @search="handleSearch"
    @reset="handleReset"
  />

  <div class="card module_card">
    <div class="class-flex">
      <index-total :totalData="state.totalData" />
      <index-table-operation :operationTable="state.operationTable" @callback="handleSubmit" />
      <index-table-screen :screeTable="state.screeTable" @callback="handleSubmit" />
    </div>

    <index-table
      class="class-table"
      :tableData="tableData"
      :meta="state.meta"
      :columns="columns"
      :params="state.params"
      @callback="handleSubmit"
    />
  </div>
</div>
```

## 状态规则

页面至少包含：

```js
const tableData = ref([])

const defaultSearchParams = {
  page: 1,
  pageSize: 15
}

const state = reactive({
  searchModel: {},
  searchParams: { ...defaultSearchParams },
  searchGroups: [],
  totalData: {},
  operationTable: {},
  screeTable: {},
  meta: {
    pagination: true,
    total: 0,
    page: 1,
    pageSize: 15
  },
  params: {}
})
```

## 请求规则

1. 列表请求统一写成 `getList`。

```js
const getList = (param = state.searchParams, replace = false) => {
  state.searchParams = replace ? { ...param } : { ...state.searchParams, ...param }
  loading.value = true

  submitItem('/v1/list', 'get', state.searchParams).then((res) => {
    loading.value = false
    if (res.code === 200) {
      tableData.value = res.data
      state.meta.page = res.meta.current_page
      state.meta.pageSize = res.meta.per_page
      state.meta.total = res.meta.total
    }
  })
}
```

2. 搜索必须重置页码。

```js
const handleSearch = (params) => {
  getList({ ...params, page: 1 }, true)
}
```

3. 重置必须使用独立 `handleReset`。

不和 `handleSearch` 共用合并逻辑。

```js
const handleReset = () => {
  state.searchModel = {}
  state.searchParams = { ...defaultSearchParams }
  getList(state.searchParams, true)
}
```

## 分页规则

分页回调允许合并当前搜索条件。

```js
const handleSubmit = (key, val) => {
  if (key === 'page' || key === 1) {
    state.meta.page = val
    getList({ page: val })
  }

  if (key === 'size') {
    state.meta.pageSize = val
    getList({ page: 1, pageSize: val })
  }
}
```

切换每页条数时，页码必须重置为第一页。

## 页面意图规则

表格页面必须通过 `pageKey + navigationIntent` 判断页面进入意图。

页面自己决定重置、恢复或刷新，不在路由守卫中直接处理页面状态。

推荐写法：

```js
const handlePageIntent = () => {
  const intent = formStore.getNavigationIntent(state.pageKey)

  if (intent === 'menu' || intent === 'resetRefresh') {
    formStore.clearNavigationIntent(state.pageKey)
    handleReset()
    return
  }

  if (intent === 'detailUpdated') {
    formStore.clearNavigationIntent(state.pageKey)
    restorePageQueryCache()
    getList()
    return
  }

  if (intent === 'refresh') {
    formStore.clearNavigationIntent(state.pageKey)
    getList()
    return
  }

  restorePageQueryCache()
  getList()
}
```

意图说明：

- `menu`：从菜单进入，清空条件、分页、排序、缓存，并重新请求。
- `detailUpdated`：详情页修改数据后返回，保留条件并重新请求。
- `resetRefresh`：主动恢复初始状态，并重新请求。
- `refresh`：保留当前条件，只重新请求。
- `back`：返回页面，保留条件。
- `replace`：替换进入页面，按页面自身规则处理。

## 操作栏规则

1. 表格操作栏统一使用 `index-table-operation`。

2. 操作配置统一放在 `state.operationTable`。

3. 导入、导出、下载、弹窗、函数请求等通用动作由操作栏组件统一处理。

页面只关心回调结果。

## 筛选栏规则

1. 表格筛选栏统一使用 `index-table-screen`。

2. 筛选配置统一放在 `state.screeTable`。

3. 筛选动作通过统一 callback 回到页面，由页面决定是否重新请求列表。
