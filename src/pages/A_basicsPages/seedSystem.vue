<template>
<div class="class-seedSystem">
  <el-container class="switchSysStyle">
    <div class="switchSysop">
      <weater-module></weater-module>
      <p class="class-title">
        <img style="width: .18rem; border-radius: 100%; position: relative; top: .06rem; right: .03rem" :src="state.userInfo?.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"/>
        <span>{{ state.userInfo?.org_name }}</span>
        <el-icon @click="outlogin" size="16" color="#fff" class="cursor"><SwitchButton /></el-icon>
      </p>
    </div>
    <div class="switchSysTitle" >
      <p><img alt="" src="../../assets/images/login_jg.png"></p>
      <p class="sys-title-text">{{ state.sysData?.sys_name }}</p>
    </div>
    <div class="contentPage">
      <seed-system-view v-if="state.showLogo" :list="subsystemlist" @item-type-go="itemTypeGO"></seed-system-view>
      <div class="swiper-container" v-else >
        <swiperDom :slides="subsystemlist" :slides-per-view="1" :space-between="20" :pagination="true" :navigation="true" nav-class="custom-nav-btn">
          <template #slide="{ item, index }">
            <div v-if="index === 0" class="swiper_Card item_swiper_special">
              <div class="special-column special-col-1">
                <div class="special-item" @click="itemTypeGO(item[0])" :style="'background: url(' + item[0]?.back_img + ')'">
                  <p><img :src="item[0]?.img_url" alt=""></p>
                  <p>{{ item[0]?.name }}</p>
                </div>
              </div>
              <div class="special-column special-col-2">
                <div v-for="(subitem, subIndex) in item.slice(1, 3)" :key="subIndex" class="special-item" @click="itemTypeGO(subitem)" :style="'background: url(' + subitem.back_img + ')'">
                  <p><img :src="subitem.img_url" alt=""></p>
                  <p>{{ subitem.name }}</p>
                </div>
              </div>
              <div class="special-column special-col-3">
                <div v-for="(subitem, subIndex) in item.slice(3, 6)" :key="subIndex" class="special-item" @click="itemTypeGO(subitem)" :style="'background: url(' + subitem.back_img + ')'">
                  <p><img :src="subitem.img_url" alt=""></p>
                  <p>{{ subitem.name }}</p>
                </div>
              </div>
            </div>
            <div v-else class="swiper_Card item_swiper_03">
              <div v-for="(subitem, subIndex) in item" :key="subIndex" class="item_swiper" @click="itemTypeGO(subitem)" :style="'background: url(' + subitem.back_img + ')'">
                <p><img :src="subitem.img_url" alt=""></p>
                <p>{{ subitem.name }}</p>
              </div>
            </div>
          </template>
        </swiperDom>
        </div>
    </div>
  </el-container>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSystemStore } from '@/store/system.js'
import { submitItem } from '@/api/index.js'
import { isUrl } from '@/utils/tools.js'
import { outlogin } from '@/api/setting.js'
import WeaterModule from "@views/Components/weaterModule.vue";
import swiperDom from "@/components/common/swiperDom.vue"

const router = useRouter()
const store = useSystemStore()

const state = reactive({
  titleName: '',
  showLogo: false,
  userInfo: store.getUserInfo,
  sysData: store.getSysInfo,
})
const subsystemlist = ref([])


const getTitleName = (name) => {
  if (name === '青海省市场监管网监信息网') {
    return name.slice(0, 7) + '<br/>' + name.slice(7)
  }
  return name
}

const getlist = async () => {
  if (subsystemlist.value && subsystemlist.value.length > 0) return
  const list = store.getSubsystemlist || []
  if (list && list.length > 0) {
    subsystemlist.value = splitArrayReduce(list)
    //getSwiper()
  }
  const res = await submitItem('/v1/users/org_systems', 'post', '')
  if (res.code === 200) {
    state.titleName = getTitleName(res.data[0].name)
    subsystemlist.value = splitArrayReduce(res.data)
    store.setSubsystemlist(res.data)
    //getSwiper()
  }
}

const splitArrayReduce = (arr) => {
  const firstGroupSize = 6;
  const otherGroupSize = 9;
  if (arr.length <= firstGroupSize) {
    return [arr];
  }
  const firstGroup = arr.slice(0, firstGroupSize);
  const remaining = arr.slice(firstGroupSize);
  const otherGroups = [];
  for (let i = 0; i < remaining.length; i += otherGroupSize) {
    otherGroups.push(remaining.slice(i, i + otherGroupSize));
  }
  return [firstGroup, ...otherGroups];
}

const getSlidesPerView = () => {
  return 1
}

const itemTypeGO = async (item) => {
  const res = await submitItem('/v1/auth/login_system', 'post', { system_id: item.id })
  if (res.code === 200) {
    if (!isUrl(item.url)) {
      const temObj = { app_id: item.id, system_id: item.id, sysname: item.name, sysname_url: item.url}
      const newUserInfo = { ...state.userInfo, ...temObj }
      store.setUserInfo(newUserInfo)
      router.push({ path: item.url, query: { systemId: item.id } })
    } else {
      const key = item.url.split('?')[1]
      let p = ''
      if (key && key === 'token') {
        p = `&t=${store.getToken}`
      }
      window.open(item.url + p)
    }
  }
}

onMounted(() => {
  if (state.userInfo && state.userInfo.area_id === 420600) {
    state.showLogo = true
  }
  getlist()
})
</script>

<style lang="scss" scoped>
$primary-color: #03a9f4;
$hover-bg: rgba(3, 169, 244, 0.15);
$hover-shadow: 0 10px 30px rgba(3, 169, 244, 0.3);
$transition-time: 0.4s;
$transition-ease: cubic-bezier(0.25, 0.8, 0.25, 1);
.cursor {
  position: relative;
  top: 5px;
}
.swiper-button-white {
  width: 40px !important;
  height: 50px !important;
  background-size: 60px 60px !important;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
@keyframes blink {
  50% {
    border-color: transparent;
  }
}
@keyframes shimmer {
  0%,
  100% {
    background-position: -200% center;
    text-shadow: 0 0 10px rgba(3, 169, 244, 0.5);
  }
  50% {
    background-position: 200% center;
    text-shadow:
      0 0 20px rgba(3, 169, 244, 0.8),
      0 0 30px rgba(3, 169, 244, 0.5);
  }
}
@keyframes glow {
  0%,
  100% {
    filter: drop-shadow(0 0 5px rgba(3, 169, 244, 0.3));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(3, 169, 244, 0.6)) drop-shadow(0 0 25px rgba(3, 169, 244, 0.3));
    transform: scale(1.02);
  }
}
@mixin hover-effect {
  position: relative;
  cursor: pointer;
  transition: all $transition-time $transition-ease;
  overflow: hidden;
  border-radius: 8px;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(3, 169, 244, 0);
    transition: all $transition-time ease;
    z-index: 1;
  }
  &:hover {
    background-size: 105% 105% !important;
    transform: translateY(-3px);
    box-shadow: $hover-shadow;
    &::before {
      background: $hover-bg;
    }
    img {
      transform: scale(1.15) rotate(3deg);
      filter: brightness(1.2);
    }
    p {
      color: $primary-color;
      text-shadow: 0 2px 10px rgba(3, 169, 244, 0.5);
    }
  }
}
.class-seedSystem {
  flex-direction: column;
  position: relative;
  justify-content: center;
  min-width: 1080px;
  .switchSysStyle {
    background: url('@image/seedSystem_bg.png') top center no-repeat fixed;
    background-size: cover;
    text-align: center;
    display: flex;
    height: 100vh;
    flex-direction: column;
    min-height: 800px;
    overflow: auto;
    .switchSysop {
      height: 80px;
      line-height: 80px;
      display: flex;
      opacity: 0;
      animation: slideDown 0.8s ease forwards;
      animation-delay: 0.2s;
      p.class-title {
        flex: 1;
        text-align: right;
        padding-right: 30px;
        font-size: 15px;
        span:nth-child(1) {
          position: relative;
          top: 6px;
        }
        span:nth-child(2) {
          padding: 0 10px;
          color: #fff;
          font-size: 16px;
        }
      }
    }
    .switchSysTitle {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 80px 0 40px;
      opacity: 0;
      animation: fadeInUp 0.8s ease forwards;
      animation-delay: 0.4s;
      p {
        &:first-child img {
          height: 6vh;
          margin-right: 35px;
        }
        &.sys-title-text {
          height: 6vh;
          line-height: 6vh;
          font-size: 0.3rem;
          font-weight: 400;
          letter-spacing: 10px;
          overflow: hidden;
          white-space: nowrap;
          background: linear-gradient(90deg, #f5f5f5, #03a9f4, #f5f5f5);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 20s linear infinite;
        }
      }
    }
  }
  .contentPage {
    width: 90%;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    opacity: 0;
    animation: fadeInUp 0.8s ease forwards;
    animation-delay: 0.6s;
    .swiper_Card {
      height: 60vh;
      overflow: hidden;
      display: flex;
      padding: 40px 0;
      align-content: flex-start;
      justify-content: left;
      width: 90%;
      margin: 0 auto;
      div.item_swiper {
        img {
          min-width: 30%;
          height: 10vh;
        }
      }
      div.item_swiper_00 {
        width: 33%;
        margin-right: 10px;
        display: block;
        border-radius: 5px;
        .item_swiper {
          margin-top: 10px;
          width: 100%;
          height: calc(66vh + 10px);
          line-height: calc(66vh + 10px);
          border-right: 5px;
          background-size: 100% 100% !important;
          background-repeat: no-repeat !important;
          justify-content: center;
          position: relative;
          p:nth-child(1) {
            width: 100%;
            img {
              width: auto;
              height: 15vh;
            }
          }
          p:nth-child(2) {
            clear: top;
            font-size: 0.19rem;
            font-weight: 500;
            color: #fff;
            height: 65px;
            line-height: 65px;
            padding: 10px 0;
            position: absolute;
            bottom: 16vh;
            text-align: center;
            width: 70%;
            left: 15%;
          }
        }
      }
      div.item_swiper_01 {
        width: 36%;
        display: block;
        .item_swiper {
          margin-top: 10px;
          width: 100%;
          height: 34vh;
          line-height: 34vh;
          border-right: 5px;
          border-radius: 8px;
          background-size: 100% 101% !important;
          background-repeat: no-repeat !important;
          justify-content: center;
          @include hover-effect;
          p:nth-child(1) {
            width: 100%;
            z-index: 2;
            img {
              max-width: 30%;
              width: auto;
              height: 12vh;
              transition: all $transition-time $transition-ease;
            }
          }
          p:nth-child(2) {
            clear: top;
            font-size: 0.14rem;
            font-weight: 500;
            color: #fff;
            height: 40px;
            line-height: 40px;
            padding: 10px 0;
            position: absolute;
            bottom: 7vh;
            text-align: center;
            width: 90%;
            left: 5%;
            z-index: 2;
            transition: all $transition-time ease;
          }
        }
      }
      div.item_swiper_02 {
        width: 33%;
        margin-top: 10px;
        align-items: flex-start;
        align-content: flex-start;
        .item_swiper {
          margin-left: 8px;
          width: calc(100% - 10px);
          height: calc(22vh - 3px);
          line-height: 20vh;
          border-right: 5px;
          background-size: 100% 100% !important;
          background-repeat: no-repeat !important;
          display: flex;
          margin-bottom: 10px;
          @include hover-effect;
          p:nth-child(1) {
            width: 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            img {
              width: auto;
              height: 10vh;
              transition: all $transition-time $transition-ease;
            }
          }
          p:nth-child(2) {
            flex: 1;
            font-size: 0.11rem;
            letter-spacing: 2px;
            font-weight: 500;
            color: #fff;
            line-height: 30px;
            padding: 0 10px;
            text-align: left;
            margin-top: 14vh;
            z-index: 2;
            transition: all 0.4s ease;
          }
        }
      }
    }
    .item_swiper_03 {
      display: flex;
      flex-wrap: wrap;
      height: 60vh;
      align-content: space-evenly;
      padding: 40px 0;
      box-sizing: border-box;
      .item_swiper {
        margin-left: 15px;
        width: calc(33% - 15px);
        height: calc(60vh / 3 - 20px);
        line-height: calc(60vh / 3 - 20px);
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        justify-content: center;
        display: flex;
        @include hover-effect;
        p:nth-child(1) {
          width: 40%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          img {
            width: auto;
            height: 7vh;
            object-fit: cover;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            filter: brightness(1);
          }
        }
        p:nth-child(2) {
          flex: 1;
          font-size: 0.11rem;
          letter-spacing: 2px;
          font-weight: 500;
          color: #fff;
          line-height: 30px;
          padding: 0 10px;
          text-align: left;
          margin-top: 13vh;
          z-index: 2;
          transition: all 0.4s ease;
        }
      }
    }
    .swiper-slide,
    .swiper-slide-active {
      width: 100% !important;
      height: 65vh !important;
      padding: 15px;
      box-sizing: border-box;
    }
    :deep(.custom-nav-btn) {
      width: 42px !important;
      height: 42px !important;
      background: transparent !important;
      color: #fff !important;
      border: none !important;
      outline: none !important;
      &::after {
        color: #fff !important;
        font-size: 42px !important;
      }
    }
    .item_swiper_special {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .special-column {
        display: flex;
        flex-direction: column;
        height: 100%;
        .special-item {
          margin-top: 15px;
          margin-left: 15px;
          width: calc(100% - 15px);
          background-size: 100% 100% !important;
          background-repeat: no-repeat !important;
          display: flex;
          justify-content: center;
          @include hover-effect;
          p:nth-child(1) {
            width: 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            img {
              width: auto;
              height: 7vh;
              object-fit: cover;
              transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
              filter: brightness(1);
            }
          }
          p:nth-child(2) {
            flex: 1;
            font-size: 0.11rem;
            letter-spacing: 2px;
            font-weight: 500;
            color: #fff;
            line-height: 30px;
            text-align: left;
            position: relative;
            top: 55%;
            left: -5%;
            z-index: 2;
            transition: all 0.4s ease;
          }
        }
      }
      .special-col-1 {
        width: calc(33% - 15px);
        .special-item {
          height: calc(65vh - 80px);
          &:hover {
            p:nth-child(1) img {
              transform: scale(1.1) translateY(-3px);
            }
          }
          p:nth-child(1) img {
            height: 15vh;
            position: relative;
            top: -8vh;
            left: 4vh;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          p:nth-child(2) {
            font-size: $s32;
            transition: all 0.4s ease;
          }
        }
      }
      .special-col-2 {
        width: calc(33% - 15px);
        .special-item {
          height: calc((65vh - 95px) / 2);
        }
      }
      .special-col-3 {
        width: calc(34% - 15px);
        .special-item {
          height: calc((65vh - 110px) / 3);
        }
      }
    }
  }
  .contentPage::-webkit-scrollbar {
    display: none;
  }
}
</style>
