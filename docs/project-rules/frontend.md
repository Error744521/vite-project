# Frontend Rules

## 目标

页面结构、组件使用和样式布局保持清晰、稳定、可复用。

页面优先完成真实业务功能，不做无意义的装饰布局。

## 页面布局

1. 页面根容器需要明确高度来源。

如果页面内容需要填充剩余高度，父级必须先具备稳定高度。

常见结构：

```vue
<div class="index-content-page">
  <div class="module_page">
    <search-form />
    <div class="card module_card">
      <index-table class="class-table" />
    </div>
  </div>
</div>
```

推荐样式：

```scss
.module_page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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
```

2. flex 子元素需要填充剩余高度时，必须设置 `min-height: 0`。

否则内容可能撑开容器，导致滚动和高度计算失效。

3. 搜索区内容过多时，不让整页失控滚动。

可以给当前页搜索组件加专属 class：

```vue
<search-form class="module_search" />
```

```scss
.module_search {
  flex: 0 0 auto;
  max-height: 45%;
  overflow: auto;
}
```

## 组件规则

1. `src/components` 按组件职责分目录。

当前目录规范：

- `base`：基础组件，例如图标、图片预览、通用弹窗、描述展示。
- `layout`：布局组件，例如顶部栏、菜单、页签。
- `business`：业务通用组件，例如页面头部。
- `business/table`：表格业务组件，例如表格、分页、筛选、操作栏、统计。
- `upload`：上传组件，例如文件上传、图片上传。

新增或迁移组件时，优先放入对应职责目录，不继续在 `src/components` 根目录平铺。

2. 页面优先使用项目已有组件。

例如：

- `page-header`
- `search-form`
- `index-total`
- `index-table-operation`
- `index-table-screen`
- `index-table`

3. 组件 props 命名必须使用当前组件明确声明的名称。

不为了兼容旧写法继续传旧 props。

例如 `index-total` 使用：

```vue
<index-total :totalData="state.totalData" />
```

不再兼容：

```vue
<index-total :data="state.totalData" />
```

4. loading 状态必须由父组件控制时，组件内部不能擅自修改父级 loading。

当 `loading === true` 时，不触发可能改变业务状态的事件。

## 样式规则

1. 不随意修改全局 `.card`。

页面个性化布局通过当前页 scoped class 处理。

2. 不把全局组件样式写成只服务一个页面的样子。

3. 需要隐藏局部边框或阴影时，优先使用当前组件 scoped 样式，不污染 Element Plus 全局样式。

4. 页面内滚动区域必须明确。

不要同时让页面、卡片、表格都滚动。

推荐：

- 搜索内容多：搜索区内部滚动。
- 表格内容多：表格区域内部滚动。
- 页面容器：通常 `overflow: hidden`。

## 事件规则

1. 事件命名要表达真实动作。

2. 不保留无意义空事件。

不推荐：

```vue
<page-header @callback="" />
```

3. 组件只暴露必要事件。

弹窗类组件通常只需要：

- 控制开关
- 提交回调

不需要额外暴露无业务价值的重复事件。
