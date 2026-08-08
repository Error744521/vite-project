import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob('./*.vue')

const components = Object.keys(modules).reduce((acc, path) => {
  const name = path.match(/([^/]+)\.vue$/)?.[1]

  if (name) {
    acc[name] = defineAsyncComponent(modules[path])
  }

  return acc
}, {})

export default components
