<template>
  <div class="el-page-class">
    <el-header><MianHeader @changeDomH="changeDomH"></MianHeader></el-header>
    <el-container>
      <el-aside :class="[showHeight ? 'domeHeight' : '']">
        <MainMenu></MainMenu>
      </el-aside>
      <el-main :class="[showHeight ? 'domeHeight' : '']">
        <MainTabs @reload="reload"></MainTabs>
        <div class="main-content">
          <router-view v-if="isRouterAlive" v-slot="{ Component, route }">
            <keep-alive>
              <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
          </router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
const showHeight = ref(true)
const changeDomH = (param) => {
  if (param === 80) {
    showHeight.value = true
  } else {
    showHeight.value = false
  }
}
const isRouterAlive = ref(true)
const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('reload', reload)
onMounted(() => {
})
</script>

<style scoped lang="scss">
.el-page-class {
  width: 1920px;
  min-width: 1920px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  .el-header {
    width: 100%;
    padding: 0;
    margin: 0;
    height: auto;
  }
}
.el-aside {
  width: auto;
  margin: 0;
  height: calc(100vh - 140px);
  padding: 15px 20px 20px 20px;
  transition: height 0.5s;
}
.el-main {
  flex: 1;
  height: calc(100vh - 135px);
  margin: 0;
  padding: 10px 20px 20px 0;
  position: relative;
  .main-content {
    height: calc(100% - 40px);
    overflow: hidden;
    border-radius: 8px;
    transition: height 0.5s;
  }
  .main-content::-webkit-scrollbar {
    display: none;
  }
}
.domeHeight {
  height: calc(100vh - 90px);
  overflow: hidden;
}
</style>
