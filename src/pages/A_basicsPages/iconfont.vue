<template>
  <div class="index-content-page">
    <div class="iconfont-page">
      <div class="card">
        <h2><span></span>使用png <code>&lt;img src="url" alt="" /&gt</code></h2>
        <ul class="icon-all-list">
          <li v-for="(item, index) in state.pnglist" :key="index">
            <p><img :src="item.url" alt="" /></p>
            <p @click="copyName(item.url)">{{ item.name }}</p>
          </li>
        </ul>
      </div>
      <div class="card">
        <h2><span></span>使用svg <code>&lt;svg-icon :size="30" :color="'#fff'" :icon-class="name" /&gt; </code></h2>
        <ul class="icon-all-list">
          <li v-for="(item, index) in state.svglist" :key="index">
            <p><svg-icon :size="'30'" :color="'#fff'" :icon-class="item" /></p>
            <p @click="copyName(item)">{{ item }}</p>
          </li>
        </ul>
      </div>
      <div class="card">
        <h2>
          <span></span>使用图标 iconfont
          <code> &lt;i :class="['iconfont', 'icon'+`${font_class}`]"&gt;&lt;/i&gt; </code>
        </h2>
        <ul class="icon-all-list">
          <li v-for="(item, index) in state.iconfontlist" :key="index">
            <p><i :class="['iconfont', 'icon' + `${item.font_class}`]"></i></p>
            <p>
              <i @click="copyName(item.font_class)">icon{{ item.font_class }}</i>
            </p>
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import iconfontJson from '@/assets/iconfont/iconfont.json'
import {useSystemStore} from '@/store/system.js'
import {assetPng, assetSvg} from '@/assets/Index.js'
import {copyName} from '@/utils/publicEvents/tools.js'

const store = useSystemStore()
const state = reactive({iconfontlist: [], pnglist: [], svglist: []})
onMounted(() => {
  state.svglist = assetSvg() || []
  state.pnglist = assetPng() || []
  state.iconfontlist = iconfontJson.glyphs
})
</script>

<style scoped lang="scss">
.iconfont-page {
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .card {
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  h2 {
    @include Hstyle(2);
    padding: 15px 0 0;
    display: flex;
    align-items: center;
    position: relative;
    span {
      display: inline-block;
      width: 6px;
      height: 40px;
      background: $mainPrimary;
      margin-right: 10px;
    }
    code {
      position: absolute;
      right: 20px;
      color: $mainPrimary;
      @include Spanstyle(3);
    }
  }
}
.icon-all-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0 0;
  overflow: auto;
  li {
    width: 106px;
    height: 100px;
    text-align: center;
    padding: 20px;
    background: #f5f5f5;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    p:nth-child(1) {
      height: 50px;
      line-height: 50px;
      i {
        font-size: 32px;
        color: #333;
      }
      img {
        width: 50px;
        height: auto;
      }
    }
    p {
      font-size: 14px;
      height: 25px;
      margin-top: 5px;
    }
  }
}
</style>
