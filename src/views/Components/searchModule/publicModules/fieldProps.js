export const fieldLabel = (field = {}) => (field.show ? field.label : '')

export const fieldPlaceholder = (field = {}, prefix = '请选择') => {
  return field.placeholder || `${prefix}${field.label || ''}`
}

export const isMultipleField = (field = {}) => field.type === 'Array' || field.valueType === 'Array'

export const optionLabel = (options = [], value) => {
  for (const option of options) {
    if (option.value === value) return option.label
    if (option.children) {
      const label = optionLabel(option.children, value)
      if (label) return label
    }
  }
  return ''
}

export const optionLabels = (options = [], value) => {
  if (Array.isArray(value)) {
    return value.map((item) => optionLabel(options, item) || item).filter(Boolean).join('、')
  }
  return optionLabel(options, value) || value || ''
}
