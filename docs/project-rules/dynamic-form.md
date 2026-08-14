# Dynamic Form Rules

## 目标

动态表单统一通过字段配置驱动，页面只维护业务数据和提交逻辑。

字段结构、组件类型、默认值和校验规则必须清晰，不保留旧配置兼容写法。

## 配置规则

字段配置必须使用直接字段结构。

推荐：

```js
company_name: {
  component: 'inputForm',
  type: 'text',
  label: '主体名称',
  key: 'company_name',
  placeholder: '请输入主体名称'
}
```

## 字段规则

每个字段必须明确：

- `component`
- `type`
- `label`
- `key`

可选字段：

- `options`
- `request`
- `modelKeys`
- `placeholder`
- `rules`
- `disabled`
- `show`

## 页面规则

1. 页面只传入表单配置和表单数据。

2. 页面提交时只处理业务请求。

3. 表单组件内部负责字段渲染，不处理页面业务。

页面调用：

```vue
<rule-form
  :fields="formFields"
  v-model="formData"
  @submit="handleSubmit"
  @reset="handleReset"
/>
```

事件规则：

- `submit`：表单校验通过后抛出完整表单数据。
- `reset`：重置完成后抛出重置后的表单数据。
- `update:modelValue`：表单值变化时同步给父组件。

不再使用旧事件：

```txt
setCallback
```

## 子组件规则

字段组件统一接收：

```js
{
  field,
  options,
  loading,
  loadOptions
}
```

字段组件只负责渲染和抛出 `update:modelValue`。

不允许字段组件内部直接请求接口。

不再使用旧写法：

```txt
attributes
list
state.list
```

## 重置规则

动态表单重置必须独立处理。

不和提交逻辑共用。

重置需要恢复：

- 表单 model
- 校验状态
- 依赖字段默认值

## 远程选项规则

1. 远程 options 必须通过 `request` 描述。

```js
request: {
  url: '/v1/options',
  method: 'get',
  param: {},
  label: 'name',
  value: 'id'
}
```

2. 接口失败时返回空数组。

不允许让未捕获 Promise 错误影响页面。

3. 静态选项统一使用 `options`。

```js
options: [
  { label: '全部', value: '' },
  { label: '交易', value: '1' }
]
```

4. 懒加载字段只在用户触发时请求。

不参与初始化批量请求。

## 方法规则

表单模块中出现通用方法时，必须先查看 `src/utils/tools.js`。

已有方法直接引用，类似方法优先扩展，没有再新增。
