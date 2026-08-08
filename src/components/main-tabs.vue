<template>
  <div class="index-tabs-page">
    <el-breadcrumb :separator-icon="ArrowRight" class="tabs-item-card">
      <el-breadcrumb-item v-for="(item, index) in store.tablist" :key="index" >
        <p class="class-breadcrumb" @click="goPage(item.url, index + 1)"><i :class="['iconfont', item.icon]"></i>{{item.name}}</p>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="index-tabs-right">
      <el-button class="tabs-btn-class" :type="item.type" v-for="(item, index) in btnlist" :key="index"
                 :color="item.color" :icon="item.icon" size="small" circle plain
                 @click="btnClick(index + 1, item.param)">
        <span>{{item.text}}</span>
      </el-button>
      <el-button class="tabs-btn-class theme-btn"  :icon="isDark ? Sunny : Moon" size="small" circle  plain :color="isDark ? '#f5a623' : '#26b0eb'" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
        <span>{{ isDark ? '亮色' : '暗色' }}</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {ArrowRight, Search, Edit, Check, Message, Star, Delete, Pointer, Sunny, Moon} from '@element-plus/icons-vue'
import { useSystemStore } from "@/store/system.js";
import router from "@/router/index.js"
import { useTheme } from '@/store/userTheme.js'
import html2canvas from "html2canvas";
import { ElMessage } from "element-plus";
const store = useSystemStore()

const goPage = (param, index) => {
  if (param && param !== '/#') {
    const list = store.tablist.slice(0, index)
    store.setTablist(list, 1)
    router.push({ path: param.url })
  }
}

const btnlist = ref([
  { text: '截图', type: '', color: '#b9b002', icon: 'Camera' },
  { text: '刷新', type: '', color: '#F56C6C', icon: 'RefreshLeft' },
])

const emit = defineEmits(['reload'])

const { toggleTheme, themeMode } = useTheme()
const isDark = computed(() => themeMode.value === 'dark')

const btnClick = (index) => {
  if (index === 1) {
    const cardElement = document.getElementById('app')
    if (cardElement) {
      html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        logging: false
      }).then(canvas => {
        const link = document.createElement('a')
        link.download = `screenshot_${new Date().getTime()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        ElMessage.success('截图成功！')
      }).catch(error => {
        console.error('截图失败:', error)
        ElMessage.error('截图失败，请重试')
      })
    } else {
      ElMessage.warning('未找到可截图的内容')
    }
  }
  if (index === 2) {
    emit('reload')
  }
}

onMounted(() => {
  if (!store.tablist) {
    store.tablist = store.getTablist
  }
})
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
