const imgList = import.meta.glob('@/assets/images/*.{png,jpeg,jpg}', { eager: true })
const pngList = import.meta.glob('@/assets/png/*.{png,jpeg,jpg}', { eager: true })
const svgList = import.meta.glob('@/assets/svg/*.svg', { eager: true })

const imageList = Object.values(imgList).map((v) => v.default)
const pngsList = Object.values(pngList).map((v) => {
  const path = v.default
  let lastIndex = path.lastIndexOf('/') // 找到最后一个'/'的位置
  let filename = path.substring(lastIndex + 1)
  const name = filename.split('.')[0]
  return { name: name, url: path }
})
const svgsList = Object.keys(svgList).map((path) => {
  let lastIndex = path.lastIndexOf('/') // 找到最后一个'/'的位置
  let filename = path.substring(lastIndex + 1)
  return filename.split('.')[0]
})

export function assetImage() {
  return imageList
}
export function assetPng() {
  return pngsList
}
export function assetSvg() {
  return svgsList
}
