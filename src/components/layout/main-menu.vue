<template>
<div class="index-menu-page">
  <p :class="isCollapse ? 'menu-index menu-in' : 'menu-index menu-out'" @click="toggleCollapse">
    <el-icon class="iconfont iconcaidan"></el-icon>
  </p>
  <el-menu v-loading="store.loading" :default-active="activeMenu" :class="isCollapse ? 'index-menu-class index-menu-narrow' : 'index-menu-class index-menu-wide'" :collapse="isCollapse" @select="handleOpen" :unique-opened="true">
    <main-menu-item
      v-for="(item, index) in menuList"
      :key="getMenuItemKey(item, index)"
      :item="item"
      :index-path="[index + 1]"
    />
  </el-menu>
</div>
</template>

<script setup>
import { useSystemStore } from "@/store/system.js";
import { useFormStore } from '@/store/formation.js'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
import MainMenuItem from '@/components/layout/main-menu-item.vue'
import { getMenuItemKey, getMenuPathByIndexes, getRoutePageKey, isValidMenuUrl, parseMenuIndexes } from '@/utils/menu.js'
import { isUrl } from '@/utils/tools.js'
const store = useSystemStore()
const formStore = useFormStore()
const route = useRoute()
const runPageAction = inject('runPageAction', null)
const isCollapse = ref(false)
const activeMenu = ref('')
const menuList = computed(() => {
  return store.menulist?.length ? store.menulist : store.getMenulist
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const setMenuIntentByUrl = (url) => {
  if (isUrl(url)) return
  const pageKey = getRoutePageKey(router, url)
  if (!pageKey) return
  formStore.clearPageCache(pageKey)
  formStore.setNavigationIntent(pageKey, 'menu')
}

const handleMenuNavigation = (menuPath) => {
  const target = menuPath[menuPath.length - 1]
  if (!isValidMenuUrl(target?.url)) return

  if (isUrl(target.url)) {
    window.open(target.url)
    return
  }

  setMenuIntentByUrl(target.url)
  store.setTablist(menuPath, 1)
  if (route.path !== target.url) {
    router.push({ path: target.url })
    return
  }

  runPageAction?.('menu')
}

const handleOpen = (key) => {
  activeMenu.value = key
  const indexes = parseMenuIndexes(key)
  const menuPath = getMenuPathByIndexes(menuList.value, indexes)
  handleMenuNavigation(menuPath)
}

const getMenuIndexByUrl = (list = [], url = '', parentPath = []) => {
  if (!isValidMenuUrl(url)) return ''

  for (let index = 0; index < list.length; index += 1) {
    const item = list[index]
    const indexPath = [...parentPath, index + 1]

    if (!isUrl(item.url) && item.url === url) {
      return indexPath.join('-')
    }

    const childIndex = getMenuIndexByUrl(item.children || [], url, indexPath)
    if (childIndex) return childIndex
  }
  return ''
}

const syncActiveMenu = () => {
  activeMenu.value = getMenuIndexByUrl(menuList.value, route.path)
}

watch([() => route.path, menuList], syncActiveMenu, {
  immediate: true,
  deep: true
})
</script>

<style scoped lang="scss">
$s64: 64px;
$s8: 8px;
$menuWide: 260px;
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
    width: $menuWide;
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
      width: $menuWide;
      overflow: auto;
      opacity: 1;
    }
  }
  @keyframes minus-width {
    0% {
      width: $menuWide;
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
