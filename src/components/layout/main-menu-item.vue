<template>
  <el-sub-menu v-if="hasChildren" :index="menuIndex">
    <template #title>
      <el-icon :class="['iconfont', item.icon_name]"></el-icon>
      <span>{{ item.menu_name }}</span>
    </template>

    <main-menu-item
      v-for="(child, childIndex) in item.children"
      :key="getMenuItemKey(child, childIndex)"
      :item="child"
      :index-path="[...indexPath, childIndex + 1]"
    />
  </el-sub-menu>

  <el-menu-item v-else :index="menuIndex">
    <el-icon :class="['iconfont', item.icon_name]"></el-icon>
    <template #title>
      <span>{{ item.menu_name }}</span>
    </template>
  </el-menu-item>
</template>

<script setup>
import { getMenuItemKey } from '@/utils/menu.js'

defineOptions({
  name: 'MainMenuItem'
})

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  indexPath: {
    type: Array,
    default: () => []
  }
})

const hasChildren = computed(() => props.item.children?.length > 0)
const menuIndex = computed(() => props.indexPath.join('-'))
</script>
