<template>
  <div class="index-header-class" :class="syslist && syslist.length > 1 ? '' : 'showH'">
    <div class="index-header-centent">
      <div class="index-header-left">
        <p class="header-login"><img src="@/assets/png/logo_gh.png" alt=""></p>
        <h2>{{state.userInfo.system_name}}</h2>
      </div>
      <div class="index-header-right">
        <div :class="[item.className]" v-for="item in tabBarlist" :key="item.type">
          <p @click="tabBar(item.url)" v-if="item.show" >
            <span v-if="item.text">{{item.text}}</span>
            <img v-if="item.img" :src="item.img" alt="">
            <i v-if="item.icon" :class="['iconfont', item.icon]"></i>
          </p>
        </div>
        <el-dropdown trigger="click" @command="handleCommand" placement="bottom-end" >
          <div class="index-header-line"><p class="fontSize"><i :class="['iconfont', 'icon-setting']"></i></p></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in commandList" :key="index" :command="item.type" :icon="item.icon">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="indec-header-subcentent">
      <ul class="index-header-tab"  :style="syslist.length >= 9 ? 'justify-content:space-between' : 'justify-content:left'">
        <li class="item-tab-select" :class="[item.id === state.selectindex ? 'active' : '']" @click="tabMenu(item, true)" v-for="(item, index) in syslist" :key="index"><p>{{item.name}}</p></li>
      </ul>
      <div class="index-header-chiltab" ref="modalWrapper" v-if="syslist.length >= 9">
        <p class="chiltab_icon" @click="sysExpand"><el-icon><Expand /></el-icon></p>
        <div class="chiltab_select" :class="[state.sysExpand ? 'RightShow' : 'RightHide']">
          <ul class="chiltab_select_ul">
            <li :class="[item.id === state.selectindex ? 'active' : '']" @click="tabMenu(item, true)" v-for="(item, index) in syslistchild" :key="index"><p>{{item.name}}</p></li>
          </ul>
        </div>
      </div>
    </div>
    <PasswordDialog v-model:visible="dialogPasswordVisible" />
  </div>
</template>

<script setup>
import { useSystemStore } from "@/store/system.js";
import { submitItem } from "@/api/index.js";
import { useRoute, useRouter } from "vue-router";
import { isUrl } from "@/utils/tools.js"
import PasswordDialog from "@views/Operation/PasswordDialog.vue";

const route = useRoute()
const router = useRouter()
const store = useSystemStore()
const state = reactive({
  sysExpand: false,
  selectindex: '',
  userInfo: {
    system_id: 1,
    system_name: '慧眼监管系统',
    name: 'admin',
    avatar: './src/assets/png/title.jpg',
  }
})
const syslist = ref([])
const syslistchild = ref([])
const emit = defineEmits(['changeDomH'])
const getSyslist = (param) => {
  syslist.value = []
  syslistchild.value = []
  submitItem('/v1/users/org_systems', 'post', {}).then(res => {
    if (res.code === 200) {
      if (res.data && res.data.length <= 1) {
        emit('changeDomH', 80)
      } else {
        emit('changeDomH', 120)
      }
      res.data.forEach((item, index) => {
        if (index <= 9) {
          syslist.value.push(item)
        } else {
          syslistchild.value.push(item)
        }
        if (item.id === param) {
          tabMenu(item, false)
        }
      })
      // 如果系统列表为空，使用默认系统
      if (res.data.length === 0) {
        const defaultSystem = { id: 1, name: '慧眼监管系统', url: '/module' }
        tabMenu(defaultSystem, true)
      }
    }
  })
}
const tabMenu = (param, type) => {
  state.sysExpand = false
  state.selectindex = param.id
  if (isUrl(param.url)) {
   window.open(param.url)
  } else {
    state.userInfo.system_id = param.id
    state.userInfo.system_name = param.name
    // 无论 type 是什么，都获取菜单数据
    store.setMenuInfo(state.userInfo)
    store.setTablist([{ name: '首页', url: param.url, icon: 'iconshangpinku' }], 1)
    //router.push({ path: param.url })
  }
}

const tabBarlist = ref([
  { type: 1, url: '/queryTool', show: true, className: 'index-header-line', text: `常用工具` },
  { type: 2, url: '', show: true, className: 'index-header-line', icon: `icon-air` },
  { type: 3, url: '/messageCenter', show: true, className: 'index-header-line', icon: `iconshejiao-youxiang` },
  { type: 4, url: '', show: true, className: 'index-header-title', img: state.userInfo.avatar },
  { type: 5, url: '', show: true, className: 'index-header-title', text: state.userInfo.name },
])
const tabBar = (param) => {

}
const commandList = ref([
  { type: 1, url: '/personalCenter', show: true, name: '个人中心', icon: 'User' },
  { type: 2, url: '/seedSystem', show: true, name: '切换系统', icon: 'TurnOff' },
  { type: 3, url: '/queryTool', show: true, name: '常用工具', icon: 'Notification' },
  { type: 4, url: '', show: true, name: '修改秘密', icon: 'Unlock' },
  { type: 5, url: '', show: true, name: '退出登陆', icon: 'SwitchButton' },
])
const dialogPasswordVisible = ref(false)
const handleCommand = (param) => {
  if (param === 4) {
    dialogPasswordVisible.value = true
  } else if (param === 5) {
    store.clearInfo()
    router.push({ path: '/login' })
  } else {
    const data = commandList.value.find(item =>  item.type === param)
    router.push({ path: data.url })
  }
 }
const sysExpand = () => {
  state.sysExpand = state.sysExpand === true ? false : true
}
const modalWrapper = ref(null)
const handleClickOutside = () => {
  if (modalWrapper.value && !modalWrapper.value.contains(event.target)) {
    state.sysExpand = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  state.userInfo = store.getUserInfo || {}
  const selectindex = state.userInfo.system_id || 1
  getSyslist(selectindex)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.index-header-class {
  background: url('@/assets/png/head-bg.png') center center no-repeat;
  background-size: 100% 100%;
  display: block;
  padding: 0 30px;
  width: 1860px;
  min-width: 1640px;
  position: relative;
  min-height: 70px;
  height: 135px;
}
.index-header-centent{
  height: 70px;
  line-height: 70px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  padding: 10px;
  .index-header-left {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    height: 50px;
    line-height: 50px;
    p.header-login {
      width: 55px;
      img {
        position: relative;
        width: auto;
        height: 55px;
        vertical-align: center;
      }
    }
    h2 {
      position: relative;
      top: 8px;
      margin-left: 20px;
      font-size: 32px;
      font-weight: bold;
      color: $white;
      letter-spacing: 3px;
    }
  }
  .index-header-right {
    min-width: 50%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: right;
    margin-top: 15px;
    height: 40px;
    line-height: 40px;
    .el-dropdown {
      font-size: $s20;
    }
    .index-header-line {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      p {
        margin-left: 15px;
        cursor: pointer;
        span {
          color: $white;
          font-size: $s20;
        }
        i {
          position: relative;
          color: $white;
          font-size: $s24;
        }
      }
      p.fontSize i {
        font-size: 28px;
      }
    }
    .index-header-title {
      height: 40px;
      line-height: 40px;
      display: flex;
      flex-wrap: nowrap;
      margin-left: 15px;
      align-items: flex-end;
      p {
        display: inline-flex;
        height: 40px;
        line-height: 40px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid $mainPrimary;
          margin: 0 5px 0 15px;
          position: relative;
          top: -5px;
          box-shadow: 0 0 10px #41d1ff;
        }
        span {
          position: relative;
          color: $white;
          font-size: $s20;
        }
      }
    }
  }
}
.indec-header-subcentent {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  .index-header-chiltab {
    margin-top: 5px;
    width: 40px;
    height: 40px;
    text-align: right;
    position: relative;
    right: -5px;
    p.chiltab_icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        color: $white;
        font-size: $s20;
      }
    }
    p.chiltab_icon:hover i {
      color: $mainPrimary;
    }
    .chiltab_select {
      width: 240px;
      height: 45vh;
      position: absolute;
      right: -10px;
      z-index: 100;
      background: #fff;
      box-shadow: 0 0 10px $mainPrimary;
      border-radius: 10px;
      padding: 10px 0;
    }
    .RightHide {
      display: none;
      animation: outRight 0.3s ease-in;
    }
    .RightShow {
      display: block;
      animation: InRight 0.3s ease-out;
    }
    @keyframes outRight {
      from {
        display: block;
        width: 240px;
        height: 50vh;
        opacity: 0.3;
        overflow: hidden;
      }
      to {
        display: none;
        width: 140px;
        height: 0;
        opacity: 0;
        overflow: hidden;
      }
    }
    @keyframes InRight {
      from {
        display: none;
        width: 140px;
        height: 0;
        opacity: 0;
        overflow: hidden;
      }
      to {
        display: block;
        width: 240px;
        height: 50vh;
        opacity: 1;
        overflow: hidden;
      }
    }
    ul.chiltab_select_ul {
      height: calc(50vh - 70px);
      overflow: auto;
      li {
        height: 50px;
        line-height: 50px;
        text-align: left;
        padding: 0 15px;
        p {
          font-size: $s16;
          color: $black-color;
        }
      }
      li:hover,
      li.active {
        background: $mainPrimary;
        p {
          color: $mainPrimary;
          cursor: pointer;
        }
      }
    }
    ul.chiltab_select_ul::-webkit-scrollbar {
      display: none;
    }
    .chiltab_select::after {
      content: '';
      position: absolute;
      right: 22px;
      top: -15px;
      z-index: 2;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom: 10px solid $white;
    }
  }
  .index-header-chiltab:focus {
    display: none;
  }
  .index-header-tab {
    flex: 1;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    height: 45px;
    line-height: 45px;
    .item-tab-select {
      margin-top: 5px;
      height: 40px;
      padding: 0 25px;
      cursor: pointer;
      transition: all 0.6s;
      overflow: hidden;
      p {
        font-size: $s16;
        color: #fff;
        letter-spacing: 1px;
        &:hover {
          color: $mainPrimary;
        }
      }
    }
    .active {
      box-shadow: inset 0 0 25px #e8f4f8;
      padding: 0 25px;
      border-radius: 10px 10px 0 0;
      letter-spacing: 1px;
      background: linear-gradient(180deg, $mainPrimary 0, #9ae1fa 50%, $white);
      transition: all 0.4s;
      z-index: 10;
      p {
        color: $blue-light;
      }
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
.showH {
  height: 90px;
  overflow: hidden;
}
</style>
