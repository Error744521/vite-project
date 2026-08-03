const normalizeGroupFields = (group = {}) => {
  if (Array.isArray(group.fields)) return group.fields
  if (import.meta.env.DEV) {
    console.warn('[searchModule] 分组配置必须使用 fields 数组')
  }
  return []
}

const normalizeField = (key, rawField = {}, options = {}) => {
  const field = {
    ...rawField,
    key: rawField.key || key,
    sourceKey: key,
    component: rawField.component,
    label: rawField.label || key,
    type: rawField.type,
    valueType: rawField.valueType || rawField.type,
    modelKeys: rawField.modelKeys || [],
    options: rawField.options || [],
    request: rawField.request || null,
    show: options.labelShow,
    labelWidth: options.labelWidth
  }

  if (!field.component && import.meta.env.DEV) {
    console.warn(`[searchModule] 字段缺少 component: ${key}`)
  }
  return field
}

export const normalizeSearchConfig = ({ groups = [], fieldMap = {}, labelShow = false, labelWidth = '' } = {}) => {
  if (!Array.isArray(groups)) {
    if (import.meta.env.DEV) {
      console.warn('[searchModule] 搜索配置必须使用分组数组')
    }
    return []
  }
  const normalizedGroups = groups
  const missingKeys = []

  const result = normalizedGroups.map((group) => {
    const fields = normalizeGroupFields(group).reduce((acc, key) => {
      const rawField = fieldMap[key]
      if (!rawField) {
        missingKeys.push(key)
        return acc
      }
      acc.push(normalizeField(key, rawField, { labelShow, labelWidth }))
      return acc
    }, [])

    return {
      label: group.label || '',
      fields
    }
  })

  if (missingKeys.length > 0 && import.meta.env.DEV) {
    console.warn(`[searchModule] 未找到字段配置: ${missingKeys.join(', ')}`)
  }

  return result
}

export const flattenSearchGroups = (groups = []) => groups.flatMap((group) => group.fields || [])
