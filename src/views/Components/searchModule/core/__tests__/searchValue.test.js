import { describe, expect, it } from 'vitest'
import { buildSearchParams, createInitialModel, isEmptySearchValue } from '../searchValue.js'

describe('searchValue', () => {
  it('只把真正的空值判定为空', () => {
    expect(isEmptySearchValue('')).toBe(true)
    expect(isEmptySearchValue(null)).toBe(true)
    expect(isEmptySearchValue(undefined)).toBe(true)
    expect(isEmptySearchValue([])).toBe(true)
    expect(isEmptySearchValue([''])).toBe(true)
    expect(isEmptySearchValue(0)).toBe(false)
    expect(isEmptySearchValue(false)).toBe(false)
  })

  it('根据字段类型创建默认值', () => {
    expect(createInitialModel([{ key: 'name' }, { key: 'ids', type: 'Array' }, { key: 'date', type: 'daterange' }])).toEqual({
      name: '',
      ids: [],
      date: []
    })
  })

  it('构建查询参数并展开多字段值', () => {
    const fields = [
      { key: 'keyword' },
      { key: 'enabled' },
      { key: 'range', modelKeys: ['start_time', 'end_time'] },
      { key: 'group', modelKeys: ['inclusion_type', 'target_ids'] },
      { key: 'dateType' },
      { key: 'empty' }
    ]
    const model = {
      keyword: '主体',
      enabled: false,
      range: ['2026-08-01', '2026-08-03'],
      group: { inclusion_type: 1, target_ids: [9] },
      dateType: { key: 'created_at', value: '2026-08-03' },
      empty: ''
    }

    expect(buildSearchParams(model, fields)).toEqual({
      keyword: '主体',
      enabled: false,
      start_time: '2026-08-01',
      end_time: '2026-08-03',
      inclusion_type: 1,
      target_ids: [9],
      created_at: '2026-08-03'
    })
  })
})
