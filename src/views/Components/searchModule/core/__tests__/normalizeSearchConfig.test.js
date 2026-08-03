import { describe, expect, it, vi } from 'vitest'
import { flattenSearchGroups, normalizeSearchConfig } from '../normalizeSearchConfig.js'

describe('normalizeSearchConfig', () => {
  it('把页面分组和字段池归一化为渲染结构', () => {
    const groups = [{ label: '基础', fields: ['company_name'] }]
    const fieldMap = {
      company_name: {
        component: 'inputEl',
        label: '主体名称',
        key: 'company_name',
        type: 'text'
      }
    }

    const result = normalizeSearchConfig({ groups, fieldMap, labelShow: true, labelWidth: '90px' })

    expect(result[0].fields[0]).toMatchObject({
      key: 'company_name',
      sourceKey: 'company_name',
      label: '主体名称',
      component: 'inputEl',
      show: true,
      labelWidth: '90px'
    })
    expect(flattenSearchGroups(result)).toHaveLength(1)
  })

  it('拒绝没有 fields 的分组配置', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = normalizeSearchConfig({
      groups: [{ label: '基础' }],
      fieldMap: {
        company_name: { component: 'inputEl', label: '主体名称', key: 'company_name' }
      }
    })

    expect(result[0].fields).toEqual([])
    expect(warn).toHaveBeenCalledWith('[searchModule] 分组配置必须使用 fields 数组')
    warn.mockRestore()
  })
})
