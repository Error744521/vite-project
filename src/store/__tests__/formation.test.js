import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@/store/formation.js'

describe('useFormStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('保留 0 和 false 这类有效查询值', () => {
    const store = useFormStore()

    store.setSearchRuleForm(0, 'status')
    store.setSearchRuleForm(false, 'enabled')

    expect(store.searchRuleForm).toEqual({
      status: 0,
      enabled: false
    })
  })

  it('删除空字符串、null、undefined 和空数组查询值', () => {
    const store = useFormStore()

    store.setSearchRuleForm('主体名称', 'keyword')
    store.setSearchRuleForm('', 'keyword')
    store.setSearchRuleForm(null, 'org_id')
    store.setSearchRuleForm(undefined, 'status')
    store.setSearchRuleForm([], 'ids')

    expect(store.searchRuleForm).toEqual({})
  })

  it('批量设置查询值时只过滤真正的空值', () => {
    const store = useFormStore()

    store.setSearchRuleForm({
      keyword: '主体名称',
      status: 0,
      enabled: false,
      emptyText: '',
      emptyArray: []
    })

    expect(store.searchRuleForm).toEqual({
      keyword: '主体名称',
      status: 0,
      enabled: false
    })
  })

  it('新增、更新和删除筛选条件记录', () => {
    const store = useFormStore()

    store.setSearchFormRecord({ name: '主体名称', value: '示例公司', key: 'company_name' })
    store.setSearchFormRecord({ name: '主体名称', value: '测试公司', key: 'company_name' })
    store.setSearchFormRecord({ name: '主体名称', value: '', key: 'company_name' })

    expect(store.searchCondition).toEqual([])
  })

  it('按页面 key 缓存和清理页面查询状态', () => {
    const store = useFormStore()
    const pageKey = 'B_networkSystem/registerBody'
    const cache = {
      searchParams: { company_name: '示例公司' },
      sortingParams: { order_flag: 1 },
      meta: { page: 2, pageSize: 15 }
    }

    store.setPageQueryCache(pageKey, cache)

    expect(store.getPageQueryCache(pageKey)).toEqual(cache)

    store.clearPageQueryCache(pageKey)

    expect(store.getPageQueryCache(pageKey)).toBeNull()
  })

  it('按页面 key 标记和清理导航意图', () => {
    const store = useFormStore()
    const pageKey = 'B_networkSystem/registerBody'

    store.setNavigationIntent(pageKey, 'detailUpdated')

    expect(store.getNavigationIntent(pageKey)).toBe('detailUpdated')

    store.clearNavigationIntent(pageKey)

    expect(store.getNavigationIntent(pageKey)).toBe('')
  })

  it('清理页面缓存时同步清理导航意图', () => {
    const store = useFormStore()
    const pageKey = 'B_networkSystem/registerBody'

    store.setPageQueryCache(pageKey, { searchParams: { keyword: 'test' } })
    store.setNavigationIntent(pageKey, 'menu')

    store.clearPageCache(pageKey)

    expect(store.getPageQueryCache(pageKey)).toBeNull()
    expect(store.getNavigationIntent(pageKey)).toBe('')
  })
})
