import request from '@/utils/request.js'
import { ElMessage } from "element-plus";
import { useSystemStore } from "@/store/system.js";
import CryptoJS from 'crypto-js';

export function setsystem (param) {
  request({
    url: `/v1/auth/login_system?system_id=${param}`,
    method: 'post',
    data: param
  }).then(res => {
    if (res.code !== 200) {
      ElMessage(res.msg)
    }
  })
}

export function login (param) {
  if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'mock') {
    console.log('[login] 加密前原文 ▶', {
      login_type: param.login_type,
      mobile: param.mobile,
      code: param.code ?? '—',
      password: param.password ?? '—',
      domain_name: param.domain_name,
    })
  }
  const ruleform = {}
  ruleform.login_type = param.login_type
  ruleform.domain_name = param.domain_name
  ruleform.mobile = encrypotion(param.mobile)
  if (param.login_type === 1) {
    ruleform.code = encrypotion(param.code)
  }
  if (param.login_type === 2) {
    ruleform.password = encrypotion(param.password)
  }
  return request({
    url: '/v1/auth/login',
    method: 'post',
    data: ruleform
  })
}

export function outlogin (param) {
  request({
    url: '/v1/auth/logout',
    method: 'post',
    data: param
  }).then(res => {
    if (res.code === 200) {
      const store = useSystemStore()
      store.clearInfo()
      window.location.href = './login'
    }
  })
}


function encrypotion (data) {
  let timestampInSeconds = Math.floor(new Date().getTime() / 1000);
  const keyStr=import.meta.env.VITE_ENCRYPT_KEY
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  if(typeof data === 'string'){
    const value = timestampInSeconds + '_' + data
    const bast64 =  CryptoJS.AES.encrypt(value.toString(), key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
    const newData=bast64.ciphertext.toString()
    return newData
  }
  if(typeof data === 'object'){
    for( const key in data){
      const value = timestampInSeconds + '_' + data[key]
      const bast64 =  CryptoJS.AES.encrypt(value.toString(), key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
      const newData=bast64.ciphertext.toString()
      data[key] = newData
    }
    return data
  }
}
