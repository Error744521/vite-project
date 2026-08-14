# Search Reset Rules

## 目标

搜索重置必须同时恢复页面查询状态和分页状态，避免页面展示已清空但请求参数仍携带旧条件。

## 规则

1. 页面必须使用独立的 `handleReset`。

`handleReset` 不和 `handleSearch` 共用合并逻辑。

2. 重置时必须清空搜索条件。

搜索条件包括：

```js
state.searchModel
state.searchParams
```

3. 如果页面存在分页，重置时必须同时重置分页。

默认分页参数：

```js
{ page: 1, pageSize: 15 }
```

如果页面使用其它分页字段，按页面接口字段同步重置，例如：

```js
{ current_page: 1, per_page: 15 }
```

## 推荐写法

```js
const defaultSearchParams = {
  page: 1,
  pageSize: 15
}

const getList = (param = state.searchParams, replace = false) => {
  state.searchParams = replace ? { ...param } : { ...state.searchParams, ...param }
  // request...
}

const handleSearch = (params) => {
  getList({ ...params, page: 1 }, true)
}

const handleReset = () => {
  state.searchModel = {}
  state.searchParams = { ...defaultSearchParams }
  getList(state.searchParams, true)
}
```

## 分页回调

分页操作允许合并当前搜索参数。

```js
const handleCallback = (key, val) => {
  if (key === 'page' || key === 1) {
    getList({ page: val })
  }
  if (key === 'size') {
    getList({ page: 1, pageSize: val })
  }
}
```

切换每页条数时，建议同步把页码重置为第一页。
