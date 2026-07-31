import { defineStore } from 'pinia'
import { getStorage } from "@/utils/publicEvents/tools.js";
import requester from "@/api/publiclist.js";

const getData = (state, key) => {
  if (state[key] && state[key].length > 0) {
    return state[key]
  } else {
    const data = JSON.parse(getStorage(key))
    return data
  }
}
export const useMultipleStore = defineStore('list', {
  state: () => {
    return {
      TargetType: [{ label: '网站', value: '9' }, { label: '网店', value: '7' }, { label: '平台', value: '6' }, { label: '公众号', value: '11' }, { label: '主播', value: '12' }, { label: '商品', value: '5' }, { label: 'App', value: '2' }, { label: '小程序', value: '10' }, { label: '本地生活', value: '8' }],
      CompanyStatus: [{ value: '', label: '全部' }, { value: 1, label: '存续' }, { label: '失效', value: 99, children:[{ value:3, label: '吊销' }, { value: 4, label: '注销' }, { value: 6, label: '迁出' }, { value: 7, label: '停业' }, { value: 8, label: '清算' }, { value: 10, label: '撤销' }]}, { label: '其他', value: 9 }],
      DateTypes: [{ label: '成立日期', value: 'establishmentDate' }, { label: '执照有效期', value: 'licenseValidity' }, { label: '更新日期', value: 'updateDate' }, { label: '创建日期', value: 'createdDate' }],
      SelectionData: [{ label: '任意类型', value: '1' }, { label: '同时包含', value: '2' }],
      CapitalData: [{ label: '100万以下', value: '1' }, { label: '100万 - 500万', value: '2' }, { label: '500万 - 1000万', value: '3' }, { label: '1000万 - 5000万', value: '4' }, { label: '5000万以上', value: '5' }],
      limitData: [{ label: '不限', value: 0 }, { label: '有', value: 1 }, { label: '无', value: 2 }],
      limitLevel: [{ label: '不限', value: 0 }, { label: 'A', value: 1 }, { label: 'B', value: 2 }, { label: 'C', value: 3 }, { label: 'D', value: 4 }, { label: 'E', value: 5 }],
    }
  },
  getters: {
    getTargetType: (state) => state.TargetType,
    getCompanyStatus: (state) => state.CompanyStatus,
    getDateTypes: (state) => state.DateTypes,
    getSelectionData: (state) => state.SelectionData,
    getCapitalData: (state) => state.CapitalData,
    getlimitData: (state) => state.limitData,
    getlimitLevel: (state) => state.limitLevel,
  },
  actions: {
  }
})

