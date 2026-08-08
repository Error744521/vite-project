<template>
<div class="index-menu-page">
  <p :class="state.isCollapse ? 'menu-index menu-in' : 'menu-index menu-out'" @click="menuClick">
    <el-icon class="iconfont iconcaidan"></el-icon>
  </p>
  <el-menu v-loading="store.loading" :default-active="state.isChoose" :class="state.isCollapse ? 'index-menu-class index-menu-narrow' : 'index-menu-class index-menu-wide'" :collapse="state.isCollapse" @select="handleOpen" :unique-opened="true">
    <template v-for="(item, level) in store.menulist" :key="level">
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="`${level + 1}`">
        <template #title>
          <el-icon :class="['iconfont', item.icon_name]"></el-icon>
          <span> {{item.menu_name}}</span>
        </template>
        <template v-for="(chilitem, levelindex) in item.children" :key="levelindex">
          <el-sub-menu v-if="chilitem.children && chilitem.children.length > 0" :index="`${level + 1}-${levelindex + 1}`">
            <template #title>
              <el-icon :class="['iconfont', chilitem.icon_name]"></el-icon>
              <span> {{chilitem.menu_name}}</span>
            </template>
            <el-menu-item v-for="(nextitem, nextindex) in chilitem.children" :index="`${level + 1}-${levelindex + 1}-${nextindex + 1}`">
              <template #title>
                <el-icon :class="['iconfont', nextitem.icon_name]"></el-icon>
                <span> {{nextitem.menu_name}}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="`${level + 1}-${levelindex + 1}`">
            <template #title>
              <el-icon :class="['iconfont', chilitem.icon_name]"></el-icon>
              <span> {{chilitem.menu_name}}</span>
            </template>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="`${level + 1}`">
        <el-icon :class="['iconfont', item.icon_name]"></el-icon>
        <template #title>
          <span> {{item.menu_name}}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</div>
</template>

<script setup>
import { useSystemStore } from "@/store/system.js";
const store = useSystemStore()
const state = reactive({
  isCollapse: false,
  isChoose: '',
})

const menuClick = () => {
  state.isCollapse = state.isCollapse ? false : true
}
const handleOpen = (key, keyPath) => {
  state.isChoose = key
  const [z, y, x] = key.split('-').map(Number);
  const Array = []
  const subindex = [z, y, x]
  const recursion = (array, index) => {
    if (!index) return false
    const item = array ? array[index - 1] : null
    if (item) {
      Array.push({ name: item.menu_name, url: item.url, icon: item.icon_name })
    }
    subindex.splice(0,1)
    recursion(item.children, subindex[0])
  }
  recursion(store.menulist, subindex[0])
  store.setTablist(Array, 1)
}

onMounted(() => {
  if (!store.menulist) {
    store.menulist = store.getMenulist
  }
})
</script>

<style scoped lang="scss">
$s64: 64px;
$s8: 8px;
@mixin br8 {
  border-radius: $s8;
}
.index-menu-page {
  @include br8;
  background: $white;
  height: 100%;
  overflow: hidden;
  position: relative;
  :deep(.el-menu) {
    border: none !important;
    .el-sub-menu__title,
    .el-menu-item-group,
    .el-menu-item {
      .el-icon {
        font-size: $s18 !important;
        color: $black-color;
      }
      span {
        font-size: $s16 !important;
        color: $black-color;
        font-weight: bold;
      }
      .el-sub-menu__icon-arrow {
        color: $black-color;
        font-weight: bold !important;
      }
    }
    .el-menu-item,
    .el-menu-item-group__title {
      font-size: $s16 !important;
    }
    .el-menu-item.is-active {
      background: $blue-light;
      .el-icon,
      span {
        color: $white;
      }
    }
  }
  .menu-index {
    @include br8;
    z-index: 10;
    width: $s64;
    height: $s64;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.4s;
    background: $white;
    i {
      font-size: $s32;
    }
  }
  .menu-out {
    transform: rotate(90deg);
    background: $white;
    i {
      color: $blue-light;
    }
  }
  .menu-in {
    transform: rotate(-90deg);
    background: $blue-light;
    border-radius: 0 $s8 $s8 0;
    i {
      color: $white;
    }
  }
  .index-menu-class {
    height: calc(100% - 80px);
    overflow-y: auto;
  }
  .index-menu-class::-webkit-scrollbar {
    display: none;
  }
  .index-menu-wide {
    width: 260px;
    border: none;
    animation: add-width 0.3s ease-in;
  }
  .index-menu-narrow {
    width: $s64;
    animation: minus-width 0.2s ease-out;
  }
  @keyframes add-width {
    0% {
      width: $s64;
      overflow: hidden;
      opacity: 0.3;
    }
    50% {
      width: 100px;
      overflow: hidden;
      opacity: 0.5;
    }
    100% {
      width: 300px;
      overflow: auto;
      opacity: 1;
    }
  }
  @keyframes minus-width {
    0% {
      width: 300px;
      overflow: hidden;
      opacity: 0.3;
    }
    50% {
      width: 200px;
      opacity: 0.5;
    }
    100% {
      width: 64px;
      overflow: hidden;
      opacity: 1;
    }
  }
}
</style>
