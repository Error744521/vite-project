<template>
<header v-if="menuList.length > 0" class="page_header">
  <el-menu :default-active="currentActiveValue" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="item in menuList" :key="item.value" :index="String(item.value)" :disabled="loading">
      <span class="style-position">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</header>
</template>
<script setup>
const emit = defineEmits(['handleSelect'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  activeValue: {
    type: [String, Number],
    default: '0'
  },
  visibleList: {
    type: Array,
    default: () => ([])
  }
})
const currentActiveValue = ref('')

const menuList = computed(() => {
  if (!Array.isArray(props.visibleList)) return []
  return props.visibleList.filter((item) => item.show !== false)
})

const setDefaultActive = () => {
  const defaultValue = props.activeValue ?? menuList.value[0]?.value ?? ''
  currentActiveValue.value = defaultValue === '' ? '' : String(defaultValue)
}

const handleSelect = (val) => {
  if (props.loading) return
  currentActiveValue.value = val
  const item = menuList.value.find((item) => String(item.value) === val)
  if (!item || !item.request) return
  emit('handleSelect', 'menu', item.request)
}

watch(() => [props.activeValue, props.visibleList], setDefaultActive, { deep: true, immediate: true })
</script>

<style scoped lang="scss">
.page_header {
  position: relative;
  width: 100%;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 13px 10px $white;
  z-index: 10;
  background-color: $white;
  .el-menu-demo {
    margin: 0 10px;
    background-color: $white;
  }
  .style-position {
    font-size: 15px;
    color: $black-color;
    font-weight: 500;
    position: relative;
    top: 6px;
  }
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  background-color: transparent;
}
</style>
