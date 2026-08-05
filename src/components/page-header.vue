<template>
<header class="page_header">
  <el-menu :default-active="handletype" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="(item, index) in list" v-show="item.show" :key="index" :index="item.value">
      <span class="style-position">{{item.label}}</span>
    </el-menu-item>
  </el-menu>
</header>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter()
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
const handletype = ref('')

const handleSelect = (val) => {
  handletype.value = val
}

onMounted(() => {
  if (Array.isArray(props.list)) {
    handletype.value = props.list[0].value
  }
})
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
