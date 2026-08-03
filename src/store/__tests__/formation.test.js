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
})
