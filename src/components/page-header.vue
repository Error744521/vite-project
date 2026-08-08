<template>
<header v-if="list.length > 0" class="page_header">
  <el-menu :default-active="handleType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="(item, index) in list" v-show="item.show" :key="index" :index="item.value">
      <span class="style-position">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</header>
</template>
<script setup>
const emit = defineEmits(['callback'])
const props = defineProps({
  loading: {
    type: [Boolean, Number],
    default: false
  },
  type: {
    type: [String, Number],
    default: 1
  },
  list: {
    type: Array,
    default: () => []
  }
})
const handleType = ref('')

const setDefaultActive = () => {
  if (!Array.isArray(props.list) || props.list.length === 0) return
  handleType.value = props.type || props.list[0].value
}

const handleSelect = (val) => {
  if (props.loading) return
  handleType.value = val
  const item = props.list.find((item) => item.value === val)
  emit('callback', item || val)
}

onMounted(setDefaultActive)

watch(() => [props.type, props.list], setDefaultActive, { deep: true })
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
