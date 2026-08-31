import { defineStore } from 'pinia'
import { isNotEmpty } from '@/utils/tools.js'

export const useFormStore = defineStore('store', {
  state: () => {
    return {
      State: false, // 重新渲染开关
      pageQueryCache: {}, // 页面查询缓存，按 pageKey 保存搜索条件、排序条件和分页参数
      navigationIntent: {}, // 页面导航意图，按 pageKey 标记 menu、refresh、resetRefresh、detailUpdated 等动作
      searchRuleForm: {}, // 搜索表单条件
      searchCondition: [], // 已选搜索条件展示列表
      selectionMultiple: [] // 表格多选数据
    }
  },
  getters: {
    // 获取指定页面的查询缓存，未命中时返回 null。
    getPageQueryCache: (state) => (pageKey) => state.pageQueryCache[pageKey] || null,

    // 获取指定页面的导航意图，未命中时返回空字符串。
    getNavigationIntent: (state) => (pageKey) => state.navigationIntent[pageKey] || '',

    // 获取搜索表单条件对象。
    getSearchRuleForm: (state) => state.searchRuleForm,

    // 获取已选搜索条件展示列表。
    getSearchCondition: (state) => state.searchCondition,

    // 获取表格多选数据。
    getSelectionMultiple: (state) => state.selectionMultiple
  },
  actions: {
    // 保存指定页面的查询状态，用于详情页返回后恢复列表条件。
    setPageQueryCache(pageKey, value) {
      if (!pageKey) return
      this.pageQueryCache[pageKey] = value
    },

    // 设置指定页面的导航意图，由列表页根据意图决定重置、恢复或刷新。
    setNavigationIntent(pageKey, intent) {
      if (!pageKey || !intent) return
      this.navigationIntent[pageKey] = intent
    },

    // 清除指定页面的查询缓存。
    clearPageQueryCache(pageKey) {
      if (!pageKey) return
      delete this.pageQueryCache[pageKey]
    },

    // 清除指定页面的导航意图，通常在页面消费意图后调用。
    clearNavigationIntent(pageKey) {
      if (!pageKey) return
      delete this.navigationIntent[pageKey]
    },

    // 同时清除指定页面的查询缓存和导航意图。
    clearPageCache(pageKey) {
      if (!pageKey) return
      delete this.pageQueryCache[pageKey]
      delete this.navigationIntent[pageKey]
    },

    // 写入搜索表单条件；值为空时删除对应字段。
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

    // 维护已选搜索条件展示列表；值为空时移除对应条件。
    setSearchFormRecord(target) {
      const array = this.searchCondition
      const index = array.findIndex((item) => item.key === target.key)
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

    // 保存表格多选结果。
    setSelectionMultiple(param) {
      this.selectionMultiple = param
    },

    // 清空搜索条件、条件展示列表和表格多选结果。
    clearRuleForm() {
      this.searchRuleForm = {}
      this.searchCondition = []
      this.selectionMultiple = []
    }
  }
})
