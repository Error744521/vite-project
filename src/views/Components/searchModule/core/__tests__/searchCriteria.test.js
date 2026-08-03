import { describe, expect, it } from 'vitest'
import { buildCriteriaList } from '../searchCriteria.js'

describe('searchCriteria', () => {
  it('根据字段和值生成筛选条件展示', () => {
    const fields = [
      { key: 'keyword', label: '主体名称' },
      { key: 'status', label: '状态' },
      { key: 'tags', label: '标签' }
    ]
    const model = {
      keyword: '示例公司',
      status: 0,
      tags: [1, 2]
    }
    const optionsMap = {
      status: [{ label: '正常', value: 0 }],
      tags: [
        { label: '重点', value: 1 },
        { label: '风险', value: 2 }
      ]
    }

    expect(buildCriteriaList(model, fields, optionsMap)).toEqual([
      { key: 'keyword', label: '主体名称', value: '主体名称: 示例公司' },
      { key: 'status', label: '状态', value: '状态: 正常' },
      { key: 'tags', label: '标签', value: '标签: 重点、风险' }
    ])
  })

  it('组合字段按左右选项分别映射展示', () => {
    const fields = [
      {
        key: 'inclusion_mode',
        label: '包含方式',
        modelKeys: ['inclusion_type', 'targe_ids'],
        options: [{ label: '任意类型', value: '1' }],
        childOptions: [
          { label: '主播', value: '12' },
          { label: '商品', value: '5' },
          { label: '网店', value: '7' }
        ]
      }
    ]
    const model = {
      inclusion_mode: {
        inclusion_type: '1',
        targe_ids: [12, 5, 7]
      }
    }

    expect(buildCriteriaList(model, fields)).toEqual([
      { key: 'inclusion_mode', label: '包含方式', value: '包含方式: 任意类型、主播、商品、网店' }
    ])
  })
})
