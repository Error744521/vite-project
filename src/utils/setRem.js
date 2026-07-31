function setRem(designWidth) {
  const docEl = document.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = () => {
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontStyle = 16 * (clientWidth / designWidth) + 'px'
  }
  if (!document.addEventListener) return
  window.addEventListener(resizeEvt, recalc, false)
  document.addEventListener('DOMContentLoaded', recalc, false)
}

setRem(1920)
export default setRem
