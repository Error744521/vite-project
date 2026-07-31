import { submitItem } from '@/api/index.js'
import { ElMessage } from 'element-plus'
import { setStorage } from '@/utils/publicEvents/tools.js'
const requester = {
  getIndustryTree: async () => {
    return await getHttp('/v1/company/industrytree', 'get', {}, 'IndustryTree', { label: 'industry', value: 'id' })
  },
  getOrganization: async (param) => {
    return await getHttp('/v1/orgs/user', 'post', { org_id: param }, 'Organization', { label: 'org_name', value: 'id' })
  },
  getCompanyTree: async () => {
    return await getHttp('/v1/company/typetree', 'get', {}, 'CompanyTree', { label: 'company_type_name', value: 'id' })
  },
  getAreaData: async (param) => {
    return await submitItem('/v1/orgs/orgdeptlist', 'post', { org_id: param }).then((res) => {
      if (res.code === 200) {
        const list = printArray(res.data, { label: 'name', value: 'id' })
        if (param) {
          return list
        } else {
          setStorage('AreaData', list)
        }
      }
    })
  },
  getRequestData: async (key, setParam, param) => {
    return await submitItem(param.url, param.method, param.data).then((res) => {
      if (res.code === 200) {
        const list = printArray(res.data, setParam)
        setStorage(key, list)
        return list
      }
    })
  }
}

const getHttp = (url, method, param, Storage, obj) => {
  return submitItem(url, method, param).then((res) => {
    if (res.code !== 200) {
      ElMessage(res.msg)
      return false
    }
    const list = printArray(res.data, obj)
    setStorage(Storage, list)
    return list
  })
}

const printArray = (array, obj) => {
  array.map((item) => {
    item.label = item[obj.label]
    item.value = item[obj.value]
    if (item.children && item.children.length > 0) {
      printArray(item.children, obj)
    }
  })
  return array
}

export default requester
