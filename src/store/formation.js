import { defineStore } from 'pinia'
import { isNotEmpty } from '@/utils/tools.js'

export const useFormStore = defineStore('store', {
  state: () => {
    return {
      State: false, //重新渲染开关
      pageQueryCache: {},
      navigationIntent: {},
      searchRuleForm: {}, //搜索条件
      searchCondition: [], //查询条件
      selectionMultiple: [] //table 选中
    }
  },
  getters: {
    getPageQueryCache: (state) => (pageKey) => state.pageQueryCache[pageKey] || null,
    getNavigationIntent: (state) => (pageKey) => state.navigationIntent[pageKey] || '',
    getSearchRuleForm: (state) => state.searchRuleForm,
    getSearchCondition: (state) => state.searchCondition,
    getSelectionMultiple: (state) => state.selectionMultiple
  },
  actions: {
    setPageQueryCache(pageKey, value) {
      if (!pageKey) return
      this.pageQueryCache[pageKey] = value
    },
    setNavigationIntent(pageKey, intent) {
      if (!pageKey || !intent) return
      this.navigationIntent[pageKey] = intent
    },
    clearPageQueryCache(pageKey) {
      if (!pageKey) return
      delete this.pageQueryCache[pageKey]
    },
    clearNavigationIntent(pageKey) {
      if (!pageKey) return
      delete this.navigationIntent[pageKey]
    },
    clearPageCache(pageKey) {
      if (!pageKey) return
      delete this.pageQueryCache[pageKey]
      delete this.navigationIntent[pageKey]
    },
    setSearchRuleForm(param, key) {
      if (key) {
        if (isNotEmpty(param)) {
          this.searchRuleForm[key] = param
        } else {
          delete this.searchRuleForm[key]
        }
      } else if (param instanceof Object) {
        Object.keys(param).forEach((keys) => {
          if (isNotEmpty(param[keys])) {
            this.searchRuleForm[keys] = param[keys]
          } else {
            delete this.searchRuleForm[keys]
          }
        })
      }
    },
    setSearchFormRecord(target) {
      const array = this.searchCondition
      const index = array.findIndex((item) => item.key === target.key) // 假设每个对象都有一个唯一的id
      if (index !== -1) {
        if (isNotEmpty(target.value)) {
          this.searchCondition[index] = target
        } else {
          this.searchCondition.splice(index, 1)
        }
      } else {
        if (!isNotEmpty(target.value)) return false
        this.searchCondition.unshift(target)
      }
    },
    setSelectionMultiple(param) {
      this.selectionMultiple = param
    },
    clearRuleForm() {
      this.searchRuleForm = {}
      this.searchCondition = []
      this.selectionMultiple = []
    }
  }
})
