# Pinia Store Rules

## 目标

Pinia 只保存跨页面共享状态和登录态相关信息。

页面局部状态不放入 store。

## 使用范围

适合放入 Pinia 的状态：

- 用户信息
- token
- 当前系统信息
- 菜单权限
- 全局配置
- 跨页面共享的业务状态

不适合放入 Pinia 的状态：

- 单个页面的搜索条件
- 单个页面的表格数据
- 单个弹窗的显示状态
- 单个表单的临时输入值
- loading 局部状态

## 登录态规则

1. token 统一从 store 或 storage 中读取。

2. 登录失效时，清理用户信息的动作由统一 API 状态处理触发。

页面不重复写登录失效清理逻辑。

3. store 中必须提供明确的清理方法。

示例：

```js
const useSystemStore = defineStore('system', {
  actions: {
    clearInfo() {
      // clear user info
    }
  }
})
```

## 菜单和权限

1. 菜单数据属于全局状态，可以放入 store。

2. 页面不要直接修改菜单原始数据。

需要派生数据时，在页面中使用 computed 或局部变量处理。

3. 权限控制逻辑应集中，不在多个页面重复判断同一套权限规则。

## 持久化规则

1. localStorage/sessionStorage 读写优先使用 `src/utils/tools.js` 中的方法。

```js
import { getStorage, setStorage, removeStorage } from '@/utils/tools.js'
```

2. store 初始化时允许从 storage 恢复必要信息。

3. 退出登录或 401 时，必须同步清理 store 和 storage 中的登录态数据。

## 修改规则

1. 修改 store 字段时，需要检查所有调用方。

```bash
rg "字段名" src
```

2. 不为了单个页面临时需求向 store 添加字段。

3. store action 必须表达业务动作。

推荐：

```js
setUserInfo()
clearInfo()
setMenuList()
```

不推荐：

```js
changeData()
setObj()
handleInfo()
```
