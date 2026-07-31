import * as validate from './validate.js'

const requiredRule = (message, trigger = 'blur') => ({
  required: true,
  message,
  trigger
})

const validatorRule = (validator, trigger = 'blur') => ({
  validator,
  trigger
})

/**
 * 通用字段校验规则集合
 * 后续新增页面表单直接在此追加，保持所有 rules 集中管理
 */
export const fieldRules = {
  mobile: [requiredRule('请输入手机号'), validatorRule(validate.checkMobile)],
  code: [requiredRule('请输入验证码'), { min: 4, max: 4, message: '验证码为4位数字', trigger: 'blur' }],
  password: [requiredRule('请输入密码'), { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }],
  email: [requiredRule('请输入邮箱'), validatorRule(validate.checkEmail)],
  phone: [requiredRule('请输入电话号'), validatorRule(validate.checkPhone)],
  url: [requiredRule('请输入URL'), validatorRule(validate.checkUrl)],
  name: [requiredRule('请输入名称'), validatorRule(validate.checkSymbol)],
  creditCode: [requiredRule('请输入社会信用代码'), validatorRule(validate.checkCode)],
  licenseCode: [requiredRule('请输入经营许可证'), validatorRule(validate.checkLicenseCode)],
  number: [requiredRule('请输入数字'), validatorRule(validate.isNumber)],
  file: [validatorRule(validate.checkfile, 'change')]
}

export const getRules = (keys = []) => {
  return keys.reduce((acc, key) => {
    if (fieldRules[key]) acc[key] = fieldRules[key]
    return acc
  }, {})
}

/*export const loginRules = getRules(['mobile', 'code', 'password'])
export const commonRules = fieldRules*/

export default getRules
