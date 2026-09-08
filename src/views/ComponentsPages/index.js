import { defineAsyncComponent } from 'vue'

// 动态导入当前目录下所有组件并批量导出
const modules = import.meta.glob('./**/*.vue')

const components = Object.keys(modules).reduce((acc, path) => {
  const name = path.match(/([^/]+)\.vue$/)?.[1]
  if (name) {
    acc[name] = defineAsyncComponent(modules[path])
  }
  return acc
}, {})

export default components
