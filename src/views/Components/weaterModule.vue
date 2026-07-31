<template>
  <p class="class-weater">
    <span>{{ state.dateTime }}</span>
    <span><img :src="`http://${state.weater?.weather_icon}`" alt="" /></span>
    <span>{{ state.weater?.temperature }} <small>℃</small></span>
    <small>{{ state.weater?.weather }}</small>
  </p>
</template>

<script setup>
import {reactive} from 'vue'
import {submitItem} from '@/api/index.js'
import {useSystemStore} from '@/store/system.js'

const store = useSystemStore()
const state = reactive({dateTime: '', weater: {}})
const fetchWeather = async () => {
  const userInfo = store.getUserInfo
  if (!userInfo?.area_id) return
  const res = await submitItem(`/v1/weather/forecast`, 'get', {area_code: userInfo.area_id})
  if (res.code === 200) {
    state.weater = res.data
  }
}
const initDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const day = now.getDay()
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  state.dateTime = `${year}年${month}月${date}日 ${week[day]}`
}
onMounted(() => {
  fetchWeather()
  initDateTime()
})</script>

<style scoped
       lang="scss">.class-weater {
  padding-left: 30px;
  color: #fff;

  span {
    display: inline-block;
    font-size: $s18;
    padding-right: 15px;
    height: 30px;
    line-height: 30px;

    img {
      width: auto;
      height: 24px;
      position: relative;
      top: 5px;
    }
  }
}</style>
