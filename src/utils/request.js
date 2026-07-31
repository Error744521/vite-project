import axios from 'axios'
import router from "@/router/index.js";
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/store/system.js'
import { getStorage } from "@/utils/tools.js";

const service = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "" : import.meta.env.VITE_BASW_URL,
  timeout: 60000, // 请求超时时间
  withCredentials: true
})
// request拦截器
service.interceptors.request.use(config => {
  config.headers.Authorization = getStorage('token', '') || ''
  config.headers['Content-Type'] = 'application/json'
  config.headers.Accept = 'application/json'
  return config
}, error => {
  ElMessage(error)
})
// respone拦截器
service.interceptors.response.use(response => {
  if (response.status !== 200) return Promise.reject(response)
    const res = response.data
    if (res.code === 200) return res

    if ( res.code === 403 ) {
      useSystemStore().clearInfo()
      router.push({ path: `/error/${res.code}`})
    } else if ( res.code >= 500) {
      router.push({ path: '/500'})
    } else {
      ElMessage(res.msg || '请求失败')
      router.push({ path: `/error/${res.code}`})
    }
    return res
}, error => {
  if(error.code ==='ECONNABORTED'){
    ElMessage('请求超时')
  }else{
    ElMessage('服务器请求超时，请重新请求！')
  }
  return Promise.reject(error)
})

export default service
