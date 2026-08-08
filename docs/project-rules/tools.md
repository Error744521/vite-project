# Tools Rules

## 目标

项目通用方法统一沉淀在 `src/utils/tools.js`。

组件、页面、业务模块中遇到通用能力时，必须优先复用 `tools.js`，避免在局部文件重复实现相同逻辑。

## 适用范围

以下类型的方法属于通用方法：

- 空值判断
- URL 判断
- 页面跳转
- 文件下载
- 图片下载
- 文件 Blob 下载
- 复制文本
- 日期格式化
- 字符串处理
- 防抖节流
- 本地存储和会话存储
- 深拷贝、对象合并
- 其它可跨页面复用的纯工具逻辑

## 开发规则

1. 写通用逻辑前，必须先查看 `src/utils/tools.js`。

2. 如果已有对应方法，直接从 `@/utils/tools.js` 引用。

```js
import { isUrl, goPage, downloadByUrl } from '@/utils/tools.js'
```

3. 如果已有类似方法，但不能完全满足当前需求，优先扩展原方法。

扩展时必须保持已有调用方式可用，不因为新增场景破坏旧页面。

4. 如果没有对应方法，再写入 `src/utils/tools.js`。

新增方法必须导出，页面或组件通过 import 使用，不允许在业务文件内重复写同类方法。

5. 组件和页面中不直接写重复 DOM 工具逻辑。

例如以下逻辑应放到 `tools.js`：

```js
const link = document.createElement('a')
link.href = url
link.click()
```

组件中只引用：

```js
import { downloadByUrl } from '@/utils/tools.js'
```

## 优化建议规则

遇到方法重复、方法命名不清晰、方法职责边界不明确、方法是否应该抽离到 `tools.js` 等问题时，必须先从架构层面给出优化建议，再进行代码调整。

优化建议需要明确以下内容：

1. 哪些方法属于纯工具方法，应该抽到 `src/utils/tools.js`。

2. 哪些方法绑定业务、API、路由、组件状态或 UI 提示，不应该抽到 `tools.js`。

3. 是否存在一层套一层的包装方法，如果存在，优先合并为一个语义明确的方法。

4. 是否存在旧方法名、旧写法或重复方法，如果存在，修改时同步更改引用名称并清理旧方法。

5. 抽离或合并后，需要检查调用方，保证引用统一。

示例：

```js
// 推荐：一个方法直接表达能力
const data = cleanParams(param)

// 不推荐：同一个功能多层包装
const data = IsObjectDel(param)
function IsObjectDel(param) {
  return cleanEmptyValue(param)
}
```

## 抽离边界

适合放入 `tools.js` 的方法必须满足以下特征：

- 不依赖页面状态
- 不依赖组件实例
- 不依赖接口返回业务结构
- 不直接处理路由跳转策略
- 不直接处理 Element Plus 消息策略
- 可以被多个页面、组件或模块复用

以下方法不应抽到 `tools.js`：

- API 状态码处理
- 登录失效处理
- 权限跳转处理
- 接口错误消息合并策略
- 请求缓存策略
- 和某个组件数据结构强绑定的方法

## 命名规则

方法名必须表达单一职责。

示例：

```js
isUrl()
goPage()
downloadByUrl()
downloadFile()
copyName()
formatDate()
```

功能重复的方法必须合并为一个主方法。

例如 URL 判断只保留：

```js
isUrl()
```

不再新增 `isLinks`、`checkUrl`、`validUrl` 等同类方法。

## 调整规则

修改 `tools.js` 时必须检查调用方：

```bash
rg "方法名\\(" src
```

确认所有调用方仍然符合新方法参数和返回值。

如果调整涉及已有页面行为，必须跑测试或构建校验。
