import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadFieldOptions } from '../searchOptions.js'

const mocks = vi.hoisted(() => ({
  submitItem: vi.fn()
}))

vi.mock('@/api/index.js', () => ({
  submitItem: mocks.submitItem
}))

describe('searchOptions', () => {
  beforeEach(() => {
    mocks.submitItem.mockReset()
  })

  it('接口失败后返回空选项并短时间复用失败缓存', async () => {
    const field = {
      key: 'org_id',
      request: { url: '/v1/error-orgs', method: 'get', param: {}, label: 'name', value: 'id' }
    }
    mocks.submitItem.mockRejectedValueOnce(new Error('500'))

    const first = await loadFieldOptions(field)
    const second = await loadFieldOptions(field)

    expect(first).toEqual([])
    expect(second).toEqual([])
    expect(mocks.submitItem).toHaveBeenCalledTimes(1)
  })

  it('同一个接口请求中复用同一个 pending promise', async () => {
    const field = {
      key: 'industry_id',
      request: { url: '/v1/pending-industry', method: 'get', param: {}, label: 'name', value: 'id' }
    }
    mocks.submitItem.mockResolvedValueOnce({ code: 200, data: [{ id: 1, name: '食品' }] })

    const [first, second] = await Promise.all([loadFieldOptions(field), loadFieldOptions(field)])

    expect(first).toEqual([{ id: 1, name: '食品', label: '食品', value: 1, children: undefined }])
    expect(second).toEqual(first)
    expect(mocks.submitItem).toHaveBeenCalledTimes(1)
  })
})
