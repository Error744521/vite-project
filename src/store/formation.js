import { defineStore } from 'pinia'
import { isNotEmpty } from '@/utils/tools.js'

export const useFormStore = defineStore('store', {
  state: () => {
    return {
      State: false, //重新渲染开关
      // Legacy search state. 新版 searchModule 已改为组件内部管理搜索状态。
      searchRuleForm: {}, //搜索条件
      searchCondition: [], //查询条件
      selectionMultiple: [] //table 选中
    }
  },
  getters: {
    getSearchRuleForm: (state) => state.searchRuleForm, //Object.keys(state.searchRuleForm).length > 0 ? state.searchRuleForm : null,
    getSearchCondition: (state) => state.searchCondition,
    getSelectionMultiple: (state) => state.selectionMultiple
  },
  actions: {
    setSearchRuleForm(param, key) {
      if (key) {
        if (!isNotEmpty(param)) {
          delete this.searchRuleForm[key]
        } else {
          this.searchRuleForm[key] = param
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
