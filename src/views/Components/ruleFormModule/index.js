import { defineAsyncComponent } from 'vue'

// 动态导入当前目录下所有组件并批量导出
const context = import.meta.glob(`@/views/components/ruleFormModule/publicModules/*.vue`);
const components = Object.keys(context).reduce((acc, path) => {
  const name = path.match(/([^/]+).vue$/)[1]; // 获取文件名作为组件名
  acc[name] = defineAsyncComponent(() => import(`./publicModules/${name}.vue`));
  return acc;
}, {})

export default components;
