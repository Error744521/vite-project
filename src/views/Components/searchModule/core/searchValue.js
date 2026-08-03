export const isEmptySearchValue = (value) => {
  if (value === '' || value === null || value === undefined) return true
  if (Array.isArray(value)) return value.length === 0 || value.every((item) => isEmptySearchValue(item))
  return false
}

export const getDefaultValue = (field = {}) => {
  if (field.defaultValue !== undefined) return field.defaultValue
  if (field.modelKeys && field.modelKeys.length > 0) return null
  if (field.valueType === 'Array' || field.type === 'Array') return []
  if (field.type === 'daterange' || field.valueType === 'daterange') return []
  return ''
}

export const createInitialModel = (fields = []) => {
  return fields.reduce((model, field) => {
    model[field.key] = getDefaultValue(field)
    return model
  }, {})
}

export const buildSearchParams = (model = {}, fields = []) => {
  return fields.reduce((params, field) => {
    const value = model[field.key]
    if (isEmptySearchValue(value)) return params

    if (value && typeof value === 'object' && !Array.isArray(value) && value.key && !isEmptySearchValue(value.value)) {
      params[value.key] = value.value
      return params
    }

    if (field.modelKeys && field.modelKeys.length > 0) {
      if (Array.isArray(value)) {
        field.modelKeys.forEach((key, index) => {
          if (!isEmptySearchValue(value[index])) {
            params[key] = value[index]
          }
        })
      } else if (typeof value === 'object') {
        field.modelKeys.forEach((key) => {
          if (!isEmptySearchValue(value[key])) {
            params[key] = value[key]
          }
        })
      }
      return params
    }

    params[field.key] = value
    return params
  }, {})
}
