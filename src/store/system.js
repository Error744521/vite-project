import { defineStore, acceptHMRUpdate } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/tools.js'
import { submitItem } from '@/api/index.js'

export const useSystemStore = defineStore('system', {
  state: () => {
    return {
      token: '',
      userInfo: '',
      sysInfo: '',
      menulist: [],
      subsystemlist: [],
      loading: false,
      tablist: []
    }
  },
  getters: {
    getToken: (state) => state.token || getStorage('token'),
    getUserInfo: (state) => state.userInfo || getStorage('userInfo', {}),
    getSysInfo: (state) => state.sysInfo || getStorage('sysInfo', {}),
    getSubsystemlist: (state) => state.subsystemlist || JSON.parse(getStorage('subsystemlist') || '[]'),
    getMenulist: (state) => (state.menulist?.length ? state.menulist : getStorage('menulist', [])),
    getTablist: (state) => (state.tablist?.length ? state.tablist : getStorage('tablist', []))
  },
  actions: {
    setTablist(param, type) {
      if (type === 1) {
        this.tablist = param
        setStorage('tablist', param)
      } else if (type === 2) {
        this.tablist.push(param)
      }
    },
    async setMenuInfo(param) {
      this.loading = true
      try {
        this.userInfo = param
        setStorage('userInfo', param)
        const res = await submitItem('/v1/users/menu', 'post', { system_id: param.system_id })
        if (res.code === 200) {
          this.menulist = res.data[0]?.children ?? []
          setStorage('menulist', this.menulist)
        }
        return res
      } catch (e) {
        this.menulist = []
        throw e
      } finally {
        this.loading = false
      }
    },
    setUserInfo(param) {
      this.userInfo = param
      this.token = param.token ? 'Bearer ' + param.token : ''
      setStorage('token', this.token)
      setStorage('userInfo', param)
    },
    setSysInfo(param) {
      setStorage('sysInfo', param)
    },
    setSubsystemlist(param) {
      setStorage('subsystemlist', param)
    },
    clearInfo() {
      this.userInfo = {}
      this.token = ''
      removeStorage('token')
      removeStorage('userInfo')
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot))
}
