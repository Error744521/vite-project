import { describe, expect, it } from 'vitest'
import { getMenuItemKey, getMenuPathByIndexes, getRoutePageKey, isValidMenuUrl, parseMenuIndexes } from '@/utils/menu.js'

describe('menu utils', () => {
  it('判断有效菜单地址', () => {
    expect(isValidMenuUrl('/registerBodyIndex')).toBe(true)
    expect(isValidMenuUrl('')).toBe(false)
    expect(isValidMenuUrl('/#')).toBe(false)
    expect(isValidMenuUrl(null)).toBe(false)
  })

  it('解析菜单索引路径', () => {
    expect(parseMenuIndexes('1-2-3')).toEqual([1, 2, 3])
    expect(parseMenuIndexes('1-a-3')).toEqual([1, 3])
  })

  it('根据索引路径生成 tab 菜单路径', () => {
    const menuList = [
      {
        menu_name: '网监系统',
        url: '/#',
        icon_name: 'icon-system',
        children: [
          {
            menu_name: '登记主体库',
            url: '/registerBodyIndex',
            icon_name: 'icon-company'
          }
        ]
      }
    ]

    expect(getMenuPathByIndexes(menuList, [1, 1])).toEqual([
      { name: '网监系统', url: '/#', icon: 'icon-system' },
      { name: '登记主体库', url: '/registerBodyIndex', icon: 'icon-company' }
    ])
  })

  it('生成菜单 key 和路由 pageKey', () => {
    const router = {
      resolve: () => ({
        meta: { pageKey: 'registerBodyIndex' }
      })
    }

    expect(getMenuItemKey({ id: 1 }, 0)).toBe(1)
    expect(getMenuItemKey({ url: '/list' }, 0)).toBe('/list')
    expect(getRoutePageKey(router, '/registerBodyIndex')).toBe('registerBodyIndex')
    expect(getRoutePageKey(router, '/#')).toBe('')
  })
})
