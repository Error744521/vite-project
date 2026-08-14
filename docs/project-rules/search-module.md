# Search Module Rules

## 目标

项目搜索功能统一使用 `src/views/Components/searchModule/index.vue`。

页面只声明搜索分组和字段 key，字段详情统一放到字段池 `public.js` 中。以后新增页面时，根据 `src/pages` 下的模块目录，在 `src/views/ComponentsPages` 下生成对应的 `public.js` 字段配置文件。

## 目录规则

公共搜索字段：

```txt
src/views/Components/searchModule/public.js
```

业务模块搜索字段：

```txt
src/views/ComponentsPages/{moduleKey}/public.js
```

`moduleKey` 默认取 `src/pages` 下一级业务目录名。

示例：

```txt
src/pages/B_networkSystem/registerBody/index.vue
src/views/ComponentsPages/B_networkSystem/public.js
```

页面使用：

```vue
<search-form
  keys="B_networkSystem"
  v-model="state.searchModel"
  :groups="state.searchGroups"
  @search="handleSearch"
  @reset="handleReset"
/>
```

不传 `keys` 时，组件读取公共字段池。

## 页面规则

页面只维护：

```js
const state = reactive({
  searchModel: {},
  searchParams: { page: 1, pageSize: 15 },
  searchGroups: [
    { label: '', fields: ['company_name', 'credit_code'] },
    { label: '筛选信息', fields: ['industry_id', 'org_id'] }
  ]
})
```

`searchGroups` 必须是数组。

每个分组必须使用 `fields` 数组。

`fields` 只写字段 key，不写字段配置详情。

## 字段池规则

字段池必须默认导出对象：

```js
const ObjectArray = {
  company_name: {
    component: 'inputEl',
    type: 'text',
    label: '主体名称',
    key: 'company_name'
  }
}

export default ObjectArray
```

字段 key 必须和页面 `searchGroups.fields` 中的值一致。

允许字段：

```js
{
  component: '组件名',
  type: '字段类型',
  label: '显示名称',
  key: '提交参数名',
  options: [],
  request: null,
  modelKeys: [],
  childOptions: [],
  placeholder: '',
  maxlength: 100
}
```

## 组件类型

### inputEl

文本输入。

```js
company_name: {
  component: 'inputEl',
  type: 'text',
  label: '主体名称',
  key: 'company_name',
  maxlength: 100
}
```

### selectEl

下拉选择。

`type: 'String'` 为单选，`type: 'Array'` 为多选。

```js
platform_id: {
  component: 'selectEl',
  type: 'Array',
  label: '电商平台经营',
  key: 'platform_id',
  options: [],
  request: {
    url: '/v1/platforms/list',
    method: 'post',
    param: { platform_type: 1 },
    label: 'platform_name',
    value: 'id'
  }
}
```

多选中的“全部”使用空字符串 `''`。

### autocompleteEl

远程或静态自动补全。

输入框展示 `label`，提交值使用 `value`。

```js
label_name: {
  component: 'autocompleteEl',
  type: 'text',
  label: '数据标签',
  key: 'label_name',
  options: [],
  request: {
    url: '/v1/labels/list',
    method: 'get',
    param: { target_type: 3 },
    label: 'label_name',
    value: 'id'
  }
}
```

### cascaderEl

普通级联。

```js
company_type_ids: {
  component: 'cascaderEl',
  type: 'Array',
  label: '主体性质',
  key: 'company_type_ids',
  options: [],
  request: {
    url: '/v1/company/typetree',
    method: 'get',
    param: {},
    label: 'company_type_name',
    value: 'id'
  }
}
```

`type: 'Array'` 为多选，清除时返回空数组。

### cascaderLazy

懒加载级联。

```js
area_ids: {
  component: 'cascaderLazy',
  type: 'Array',
  label: '所属区域',
  key: 'area_ids',
  options: [],
  request: {
    url: '/v1/orgs/orgdeptlist',
    method: 'post',
    param: {},
    key: 'org_id',
    label: 'name',
    value: 'id'
  }
}
```

懒加载字段不会在搜索组件初始化时批量请求，只在用户展开节点时请求。

接口失败时必须返回空数组，不允许抛出未捕获 Promise。

### datepickerEl

普通日期或日期范围。

```js
create_at: {
  component: 'datepickerEl',
  type: 'date',
  label: '创建时间',
  key: 'create_at'
}
```

日期范围：

```js
time_period: {
  component: 'datepickerEl',
  type: 'daterange',
  label: '起止日期',
  key: 'time_period',
  modelKeys: ['start_time', 'end_time']
}
```

### datepickergroupEl

左侧选择日期类型，右侧选择日期或日期范围。

```js
updateDate: {
  component: 'datepickergroupEl',
  type: 'date',
  label: '日期类型',
  key: 'time_type',
  options: [{ label: '成立日期', value: 'establishmentDate' }]
}
```

提交值为动态 key：

```js
{ key: 'establishmentDate', value: '2026-08-05' }
```

最终搜索参数会转换为：

```js
{ establishmentDate: '2026-08-05' }
```

### selectGroup

组合字段，左侧选择类型，右侧选择目标。

```js
inclusion_mode: {
  component: 'selectGroup',
  type: 'Array',
  label: '包含方式',
  key: 'inclusion_mode',
  modelKeys: ['inclusion_type', 'targe_ids'],
  options: [{ label: '任意类型', value: '1' }],
  childOptions: [{ label: '网站', value: '9' }]
}
```

提交值：

```js
{
  inclusion_type: '1',
  targe_ids: ['9']
}
```

最终搜索参数会展开为：

```js
{
  inclusion_type: '1',
  targe_ids: ['9']
}
```

### radioGroup

单选条件。

```js
rang_flag: {
  component: 'radioGroup',
  type: 'radio',
  label: '辖区内外',
  key: 'rang_flag',
  options: [
    { label: '全部', value: '' },
    { label: '辖区内', value: 1 },
    { label: '辖区外', value: 2 }
  ]
}
```

### checkboxGroup

复选条件。

```js
live_auth_type: {
  component: 'checkboxGroup',
  type: 'checkbox',
  label: '认证方式',
  key: 'live_auth_type',
  options: [],
  request: {
    url: '/v1/liveuserextend/live_user_filter_can',
    method: 'get',
    param: { type: 1 },
    label: 'value',
    value: 'id'
  }
}
```

### classificationGroup

分类标签组。

```js
live_user_cate: {
  component: 'classificationGroup',
  type: 'Array',
  label: '主播类型',
  key: 'live_user_cate',
  options: [],
  request: {
    url: '/v1/liveuserextend/live_user_cate_can',
    method: 'get',
    param: {},
    label: 'value',
    value: 'id'
  }
}
```

## request 规则

接口选项统一写在字段配置的 `request` 中。

```js
request: {
  url: '/v1/xxx',
  method: 'get',
  param: {},
  label: '接口返回名称字段',
  value: '接口返回值字段',
  children: 'children',
  cache: true
}
```

默认会把接口数据格式化成：

```js
{
  label: item[label],
  value: item[value],
  children: item[children]
}
```

不允许字段组件内部直接写接口请求。

## 搜索参数规则

普通字段：

```js
{ [field.key]: value }
```

`modelKeys` 数组字段：

```js
modelKeys: ['start_time', 'end_time']
```

数组值会按索引展开：

```js
['2026-08-01', '2026-08-05']
```

转换为：

```js
{
  start_time: '2026-08-01',
  end_time: '2026-08-05'
}
```

动态 key 字段：

```js
{ key: 'establishmentDate', value: '2026-08-05' }
```

转换为：

```js
{ establishmentDate: '2026-08-05' }
```

空值不提交。

空值包括：

```js
''
null
undefined
[]
['']
```

`0` 和 `false` 是有效值，必须提交。

## 新增页面生成流程

1. 根据页面路径确定模块名。

```txt
src/pages/C_exampleSystem/userList/index.vue
```

模块名：

```txt
C_exampleSystem
```

2. 生成字段池。

```txt
src/views/ComponentsPages/C_exampleSystem/public.js
```

3. 在页面中声明搜索组件。

```vue
<search-form
  keys="C_exampleSystem"
  v-model="state.searchModel"
  :groups="state.searchGroups"
  @search="handleSearch"
  @reset="handleReset"
/>
```

4. 根据页面表格、接口参数、筛选项生成字段配置。

5. 页面 `searchGroups.fields` 引用字段 key。

6. 如果字段可复用，优先放到公共字段池；如果只属于当前业务，放到业务字段池。

## 质量检查

新增或修改搜索字段后必须检查：

```bash
npm test
npm run build:test
```
