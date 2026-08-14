<template>
  <div class="index-tabs-page">
    <el-breadcrumb :separator-icon="ArrowRight" class="tabs-item-card">
      <el-breadcrumb-item v-for="(item, index) in tabList" :key="item.url || index" >
        <p class="class-breadcrumb" @click="handleTabClick(item.url, index + 1)"><i :class="['iconfont', item.icon]"></i>{{item.name}}</p>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="index-tabs-right">
      <el-button class="tabs-btn-class" :type="item.type" v-for="item in btnlist" :key="item.key"
                 :color="item.color" :icon="item.icon" size="small" circle plain
                 @click="btnClick(item.key)">
        <span>{{item.text}}</span>
      </el-button>
      <el-button class="tabs-btn-class theme-btn"  :icon="isDark ? Sunny : Moon" size="small" circle  plain :color="isDark ? '#f5a623' : '#26b0eb'" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
        <span>{{ isDark ? '亮色' : '暗色' }}</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight, Sunny, Moon } from '@element-plus/icons-vue'
import { useSystemStore } from "@/store/system.js";
import router from "@/router/index.js"
import { useTheme } from '@/store/userTheme.js'
import html2canvas from "html2canvas";
import { ElMessage } from "element-plus";
import { isValidMenuUrl } from '@/utils/menu.js'
const store = useSystemStore()

const tabList = computed(() => {
  return store.tablist?.length ? store.tablist : store.getTablist
})

const handleTabClick = (url, index) => {
  if (!isValidMenuUrl(url)) return
  const list = tabList.value.slice(0, index)
  store.setTablist(list, 1)
  router.push({ path: url })
}

const btnlist = [
  { key: 'screenshot', text: '截图', type: '', color: '#b9b002', icon: 'Camera' },
  { key: 'reload', text: '刷新', type: '', color: '#F56C6C', icon: 'RefreshLeft' },
]

const emit = defineEmits(['page-action'])

const { toggleTheme, themeMode } = useTheme()
const isDark = computed(() => themeMode.value === 'dark')

const handleScreenshot = async () => {
  const cardElement = document.getElementById('app')
  if (!cardElement) {
    ElMessage.warning('未找到可截图的内容')
    return
  }

  try {
    const canvas = await html2canvas(cardElement, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    const link = document.createElement('a')
    link.download = `screenshot_${new Date().getTime()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    ElMessage.success('截图成功！')
  } catch (error) {
    console.error('截图失败:', error)
    ElMessage.error('截图失败，请重试')
  }
}

const handleReload = () => {
  emit('page-action', 'resetRefresh')
}

const btnClick = (key) => {
  if (key === 'screenshot') handleScreenshot()
  if (key === 'reload') handleReload()
}
</script>

<style scoped lang="scss">
.index-tabs-page {
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  .tabs-item-card {
    height: 40px;
    line-height: 40px;
    .class-breadcrumb {
      .iconfont {
        font-size: $s16;
        margin-right: 5px;
        color: $cyan-color;
      }
      font-size: $s14;
      color: $cyan-color;
      &:hover {
        color: $mainPrimary;
        .iconfont {
          color: $mainPrimary;
        }
      }
    }
    .el-breadcrumb__separator {
      font-size: $s18;
    }
  }
}
.index-tabs-right {
  height: 40px;
  line-height: 40px;
  flex: 1;
  align-items: center;
  text-align: right;
  .tabs-btn-class {
    height: auto;
    justify-content: space-between;
    span {
      display: none;
      transition: width;
    }
  }
  .tabs-btn-class:hover {
    width: auto;
    border-radius: 5px;
    padding: 5px 10px;
    span {
      transition: width;
      display: inline-block;
    }
  }
}
</style>
