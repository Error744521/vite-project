import { describe, expect, it } from 'vitest'
import { parseEnvArray } from '@/utils/tools.js'

describe('parseEnvArray', () => {
  it('空字符串返回默认 all', () => {
    expect(parseEnvArray('')).toEqual(['all'])
  })
  it('逗号分割字符串转数组', () => {
    expect(parseEnvArray('a,b,c')).toEqual(['a', 'b', 'c'])
  })
  it('数字字符串转数字数组', () => {
    expect(parseEnvArray('1,2,3')).toEqual([1, 2, 3])
  })
})
