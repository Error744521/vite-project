const INVALID_MENU_URLS = new Set(['', '/#'])

export const isValidMenuUrl = (url) => {
  return typeof url === 'string' && url.length > 0 && !INVALID_MENU_URLS.has(url)
}

export const normalizeMenuItem = (item = {}) => ({
  name: item.menu_name,
  url: item.url,
  icon: item.icon_name
})

export const getMenuItemKey = (item = {}, index = '') => {
  return item.id || item.url || item.menu_name || index
}

export const parseMenuIndexes = (key) => {
  return String(key)
    .split('-')
    .map(Number)
    .filter(Number.isInteger)
}

export const getMenuPathByIndexes = (menuList = [], indexes = []) => {
  const menuPath = []
  let children = Array.isArray(menuList) ? menuList : []

  for (const index of indexes) {
    const item = children[index - 1]
    if (!item) return []

    menuPath.push(normalizeMenuItem(item))
    children = Array.isArray(item.children) ? item.children : []
  }

  return menuPath
}

export const getRoutePageKey = (router, url) => {
  if (!router || !isValidMenuUrl(url)) return ''
  return router.resolve({ path: url }).meta?.pageKey || ''
}
