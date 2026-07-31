import { ElMessage } from 'element-plus'
import request from '@/utils/request.js'

// API 请求缓存
const requestCache = new Map()

// 生成缓存键
function generateCacheKey(url, type, param) {
  const data = IsObjectDel({...param})
  const paramStr = JSON.stringify(data)
  return `${url}_${type}_${paramStr}`
}

export async function submitItem (url, type, param = {}) {
  const data = IsObjectDel(param)
  const cacheKey = generateCacheKey(url, type, param)
  if (requestCache.has(cacheKey)) {
    return Promise.resolve(requestCache.get(cacheKey))
  }
  if (type === 'get') {
    const parameters = urlEncode(data, '', false)
    url = url + parameters.replace(/&/, "?")
  }
  try {
    const response = await request({ url: url, method: type, data: type === 'get' ? '' : data })
    if (response?.code === 200) {
      requestCache.set(cacheKey, response)
    }
    return response
  } catch (err) {
    const msg = err.msg || '请求失败'
    ElMessage.error(msg)
    throw err
  }
}

/**
* src 图片链接 导出
* name: 图片导出名称
* */
export function downloadImage (src, name) {
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = name || 'image'
    a.href = url
    a.dispatchEvent(event)
  }
  image.src = src
}

/**
* file 文件 导出
* name: 导出名称
*/
export function downloadFile (file, name) {
  const elelink = document.createElement('a')
  elelink.download = name
  elelink.style.display = 'none'
  const blob = new Blob([file])
  elelink.href = URL.createObjectURL(blob)
  document.body.appendChild(elelink)
  elelink.click()
  document.body.removeChild(elelink)
}


/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
function urlEncode (param, key, encode) {
  if (param == null) return ''
  let paramStr = ''
  const t = typeof (param)
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
  } else {
    for (const i in param) {
      const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr //
}

/**
 * param  过滤对象中值为null的空对象
 *
 * return param参数对象
 */
function IsObjectDel(param) {
  const result = { ...param }
  Object.keys(result).forEach(key => {
    if (result[key] === '' || result[key] === null || result[key] === undefined) {
      delete result[key]
    }
  })
  return result
}
