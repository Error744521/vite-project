import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getStorage } from "@/utils/tools.js";

const service = axios.create({
  baseURL: import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.MODE === 'development' ? "" : import.meta.env.VITE_BASE_URL,
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
  return Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(response => {
  if (response.status !== 200) return Promise.reject(response)
  return response.data
}, error => {
  if(error.code ==='ECONNABORTED'){
    ElMessage('请求超时')
  } else{
    ElMessage('服务器请求超时，请重新请求！')
  }
  return Promise.reject(error)
})

export default service
