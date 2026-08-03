import { isEmptySearchValue } from './searchValue.js'

const findOptionLabel = (options = [], value) => {
  for (const option of options) {
    if (option.value === value || String(option.value) === String(value)) return option.label
    if (option.children) {
      const childLabel = findOptionLabel(option.children, value)
      if (childLabel) return childLabel
    }
  }
  return ''
}

const formatValue = (value, options = []) => {
  if (value && typeof value === 'object' && !Array.isArray(value) && value.key) {
    return Array.isArray(value.value) ? value.value.join('/') : value.value
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value)
      .filter((item) => !isEmptySearchValue(item))
      .map((item) => formatValue(item, options))
      .join(':')
  }
  if (Array.isArray(value)) {
    return value
      .filter((item) => !isEmptySearchValue(item))
      .map((item) => findOptionLabel(options, item) || item)
      .join('、')
  }
  return findOptionLabel(options, value) || value
}

const formatFieldValue = (value, field = {}, options = []) => {
  if (value && typeof value === 'object' && !Array.isArray(value) && field.modelKeys?.length > 0) {
    const [leftKey, rightKey] = field.modelKeys
    const leftText = formatValue(value[leftKey], options)
    const rightText = formatValue(value[rightKey], field.childOptions || [])
    return [leftText, rightText].filter((item) => !isEmptySearchValue(item)).join('、')
  }
  return formatValue(value, options)
}

export const buildCriteriaList = (model = {}, fields = [], optionsMap = {}) => {
  return fields.reduce((list, field) => {
    const value = model[field.key]
    if (isEmptySearchValue(value)) return list

    list.push({
      key: field.key,
      label: field.label,
      value: `${field.label}: ${formatFieldValue(value, field, optionsMap[field.key] || field.options || [])}`
    })
    return list
  }, [])
}
