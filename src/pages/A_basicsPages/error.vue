<template>
  <div class="index-content-page">
    <div class="error_page">
        <div class="error_content">
          <div class="error_content_svg">
            <svg-icon :size="'1rem'" :icon-class="'出错了'" />
          </div>
          <div class="error_content_right">
            <p class="error_status" v-if="pageData.type > 1">{{pageData.type}}</p>
            <h2 class="error_text">{{pageData.message}}</h2>
            <p class="error_btn">
              <span @click="goPage(pageData.url)">{{pageData.text}} &gt&gt</span>
            </p>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const statuslist = ref([
  { type: 304, message: '缓存内容！', text: '返回', url: '/#' },
  { type: 401, message: '请求出错！', text: '返回', url: '/#' },
  { type: 403, message: '请求方式不对！', text: '去登陆', url: '/login' },
  { type: 404, message: '找不到内容！', text: '返回', url: '/#' },
])

const goPage = (url) => {
  if (url === '/#') {
    router.back(-1)
  } else {
    router.push({ path: url })
  }
}

const pageData = ref({ type: 1, message: '内容报错！', text: '返回', url: '/#' })
onMounted(() => {
  const param = Number(route.params.id) || ''
  statuslist.value.map(item => {
    if (item.type === param) {
      pageData.value = item
    }
  })
})
</script>

<style scoped lang="scss">
.error_page {
  padding: 20px;
  height: calc(100% - 40px);
  background: $white;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  .error_content {
    @include flexwrap(nowrap);
    .error_content_svg {
      margin-right: 30px;
    }
    .error_status {
      @include Hstyle(8);
      color: $black-dark;
    }
    .error_text {
      @include Pstyle(6);
      color: $black-color;
      margin: 15px 0;
    }
    .error_btn span {
      @include Spanstyle(4);
      color: $mainPrimary;
      cursor: pointer;
    }
    .error_content_right {
      margin-top: 20px;
    }
  }
}
</style>
