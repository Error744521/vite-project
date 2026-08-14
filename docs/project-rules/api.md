# API Rules

## 目标

项目接口统一通过 `src/api/index.js` 暴露的 `submitItem` 调用。

`src/utils/request.js` 只负责 axios 基础配置、请求拦截和 HTTP 层错误。业务状态码、消息提示、错误日志、登录失效、权限跳转、服务异常跳转统一交给 API 层处理。

## 文件职责

`src/api` 下的 `.js` 文件功能独立，不混放多类能力。

```txt
src/api/index.js
src/api/useFieldOptions.js
src/api/RequestStateManager.js
src/api/setting.js
```

### `index.js`

定位：项目 API 统一请求入口。

抛出能力：

- `submitItem`

内部能力：

- 参数分发
- 空值处理
- 状态码处理
- 消息合并
- 错误日志
- 请求缓存
- 登录失效、权限错误、服务异常跳转

适用场景：通用请求。

基础调用：

```js
submitItem(url, method, param, options)
```

参数说明：

- `url`：接口地址。
- `method`：请求方式，默认 `get`。GET 请求参数走 axios `params`，非 GET 请求参数走 `data`。
- `param`：请求参数。提交前必须清理 `''`、`null`、`undefined`，数组和对象内部也需要递归清理。
- `options`：请求行为配置。

支持的 `options`：

```js
{
  silent: true, // 不弹出 API 成功或失败消息
  showSuccess: true, // 成功时加入统一成功消息队列
  successMessage: '操作成功', // 成功提示文案
  cache: true // 是否允许缓存请求结果
}
```

### `useFieldOptions.js`

定位：字段选项请求和标准化能力。

抛出能力：

- `useFieldOptions`
- `normalizeOptions`

内部能力：

- 静态 `options` 读取
- 远程 `options` 请求
- 选项缓存
- `label/value/children` 标准化
- 输出 `loading/list/loadOptions`

适用场景：搜索字段、动态表单字段、下拉、单选、多选、级联等字段选项。

基础调用：

```js
const {
  loading,
  list,
  loadOptions
} = useFieldOptions(fieldRef)
```

字段规则：

- 入参命名使用 `fieldRef`。
- 静态选项统一使用 `options`。
- 远程选项统一使用 `request`。

### `RequestStateManager.js`

定位：通用请求状态管理类。

抛出能力：

- `RequestStateManager`

内部能力：

- `loading`
- `data`
- `error`
- `dedupe`
- `onlyLatest`
- `debounceRun`
- `reset`

适用场景：搜索输入防抖请求、只保留最后一次请求结果、相同参数请求去重、组件独立维护请求状态、表单的提提交/保存/确认/搜索 菜单的切换。

基础调用：

```js
const manager = new RequestStateManager(requestFn, {
  debounceTime: 300,
  onlyLatest: true,
  dedupe: true,
  defaultData: []
})
```

### `setting.js`

定位：认证相关 API。

抛出能力：

- `setsystem` //系统切换
- `login` //登录
- `outlogin` //退出登录

内部能力：
- 登录参数加密


适用场景：特殊的api 请求都写入 抛出对应能力。

## 返回结构

接口响应体统一按以下结构处理：

```js
{
  code: 200,
  msg: '请求成功',
  data: {},
  meta: {}
}
```

字段说明：

- `code`：业务状态码。
- `msg` / `message`：业务提示文案。
- `data`：业务数据。
- `meta`：分页、统计等附加信息。

页面只处理业务数据，不重复处理通用状态码提示。

## 状态码规则

HTTP 状态和业务状态分开处理：

- `request.js` 处理 HTTP 层 `response.status`。
- `api/index.js` 处理响应体业务状态 `res.code`。

常用业务状态：

```js
200: 请求成功
201: 创建成功
204: 操作成功但无返回内容
400: 请求格式不对
401: 没登录
403: 没权限
404: 地址不存在
405: 请求方法不支持
422: 请求参数错误
429: 请求太频繁
500: 服务器内部错误
502: 网关错误
503: 服务不可用
504: 网关超时
```

## 消息规则

API 消息统一合并处理。

当一个页面同时发起多个请求时：

- 全部成功：只提示一条成功消息。
- 有失败：只提示最严重的一条失败消息。
- 多个失败：页面只提示最严重的一条，控制台打印全部失败原因。

## 缓存规则

默认只缓存 GET 请求。

非 GET 请求不允许默认缓存。新增、删除、导入、导出、修改等请求只有在明确配置后才允许缓存。

缓存键由以下内容生成：

- `url`
- `method`
- 清理后的 `param`

## 调用示例

列表请求：

```js
const res = await submitItem('/v1/websites', 'get', {
  page: 1,
  pageSize: 15,
  company_name: state.searchModel.company_name
})
```

新增请求：

```js
const res = await submitItem('/v1/users', 'post', formModel.value, {
  showSuccess: true,
  successMessage: '新增成功'
})
```

静默请求：

```js
const res = await submitItem('/v1/logs', 'get', params, {
  silent: true
})
```

## 禁止事项

1. 不允许页面、组件、store 直接引用 `src/utils/request.js`。

2. 不允许手动拼接 GET query 字符串。

3. 不允许页面重复处理通用状态码、登录失效、权限跳转、服务异常跳转。

4. 不允许把 API 业务策略抽到 `tools.js`。
