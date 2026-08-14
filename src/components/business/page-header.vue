<template>
<header v-if="visibleList.length > 0" class="page_header">
  <el-menu :default-active="activeValue" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="item in visibleList" :key="item.value" :index="String(item.value)">
      <span class="style-position">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</header>
</template>
<script setup>
const emit = defineEmits(['callback', 'select'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  handleType: {
    type: [String, Number],
    default: '1'
  },
  list: {
    type: Array,
    default: () => ([])
  }
})
const activeValue = ref('')

const visibleList = computed(() => {
  if (!Array.isArray(props.list)) return []
  return props.list.filter((item) => item.show !== false)
})

const setDefaultActive = () => {
  if (visibleList.value.length === 0) return
  activeValue.value = String(props.handleType || visibleList.value[0].value)
}

const handleSelect = (val) => {
  if (props.loading) return
  activeValue.value = val
  const item = visibleList.value.find((item) => String(item.value) === val)
  emit('select', item || val)
  emit('callback', item || val)
}

onMounted(setDefaultActive)

watch(() => [props.handleType, props.list], setDefaultActive, { deep: true })
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
</style>
