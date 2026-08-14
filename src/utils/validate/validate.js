/**
 * 底层工厂：基于正则创建 Element Plus 表单 validator
 * 规则：空值（''、null、undefined）统一通过 —— 必填由 required: true 负责
 * 扩展新校验时只需在 REG 中加正则，再调用 createRegexValidator 导出即可
 */
function createRegexValidator(regex, errMsg) {
  return function (rule, value, cb) {
    if (!value || regex.test(value)) return cb()
    cb(new Error(errMsg))
  }
}

// ─── 正则常量（统一维护，避免散落在各函数内）────────────────────
const REG = {
  mobile: /(^1[3-9]\d{9}$)|(^09\d{8}$)/,
  email: /^([a-zA-Z0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
  symbol: /^[\u4e00-\u9fa5_a-zA-Z0-9().·-]+$/,
  creditCode: /^[a-zA-Z0-9]+$/,
  licenseCode: /^JY[213][1-8][0-7]\d{11}$/,
  url: /^(https?):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
  number: /^[0-9]*$/
}

// ─── 导出校验函数 ─────────────────────────────────────────────

/**
 * 手机号（大陆 1[3-9]xxxxxxxxx + 台湾 09xxxxxxxx）
 * checkPhone / checkLoginPhone 正则完全相同，合并为 checkMobile
 * 两个旧名称保留为别名，已有引用无需修改
 */
export const checkMobile = createRegexValidator(REG.mobile, '请输入正确的手机号')

export const checkPhone = createRegexValidator(REG.mobile, '请输入正确的电话号')

/** 邮箱 */
export const checkEmail = createRegexValidator(REG.email, '请输入正确的邮箱')

/** 不含特殊符号（支持中文、字母、数字及 _.()·-） */
export const checkSymbol = createRegexValidator(REG.symbol, '不能含有特殊符号 如：空格')

/** 社会信用代码 */
export const checkCode = createRegexValidator(REG.creditCode, '请输入正确的社会信用代码')

/** 经营许可证 */
export const checkLicenseCode = createRegexValidator(REG.licenseCode, '请输入正确的经营许可证')

/** URL */
export const checkUrl = createRegexValidator(REG.url, '请输入正确的URL')

/** 纯数字 */
export const isNumber = createRegexValidator(REG.number, '请输入数字')

/** 文件上传必填（非正则，单独处理） */
export function checkfile(rule, value, cb) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return cb(new Error('请上传文件'))
  }
  cb()
}
