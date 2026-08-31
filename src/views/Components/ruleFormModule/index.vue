<template>
  <el-form ref="formRef" v-loading="loading" :model="ruleForm" :rules="rules" :label-width="labelWidth" class="demo-form">
    <el-form-item v-for="field in formFields" :key="field.key" :label="field.show ? field.label : ''" :prop="field.key">
      <component class="class-component" :is="getComponent(field.component)"
        :model-value="getComponentValue(field)" :field="field" :options="getFieldOptions(field.key)" :loading="loadingMap[field.key] || false" :load-options="loadOptions"
        @update:model-value="setComponentValue(field, $event)"
      />
    </el-form-item>
    <el-form-item label="" class="class-form-button">
      <el-button @click="resetForm" :icon="Refresh">{{ resetText }}</el-button>
      <el-button type="primary" @click="submitForm" :icon="Finished">{{ submitText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { Finished, Refresh } from '@element-plus/icons-vue'
import { submitItem } from '@/api/index.js'
import { getOptionData, normalizeOptions } from '@/api/useFieldOptions.js'
import components from './index.js'

const emit = defineEmits(['submit', 'reset', 'update:modelValue'])
const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  labelWidth: {
    type: String,
    default: '20em'
  },
  submitText: {
    type: String,
    default: '提交'
  },
  resetText: {
    type: String,
    default: '重置'
  }
})

const formRef = ref(null)
const ruleForm = ref({})
const loading = ref(false)
const loadingMap = ref({})
const optionsMap = ref({})
const formFields = ref([])
const optionRequestMap = new Map()
const failedOptionRequestMap = new Map()
const SUCCESS_CODES = [200, 201, 204]
const EMPTY_OPTIONS = []

const labelWidth = computed(() => props.labelWidth)
const submitText = computed(() => props.submitText)
const resetText = computed(() => props.resetText)

const getComponent = (name) => components[name]

const getFieldOptions = (key) => {
  return optionsMap.value[key] || EMPTY_OPTIONS
}

const getFieldModelKeys = (field = {}) => {
  return Array.isArray(field.modelKeys) && field.modelKeys.length > 0 ? field.modelKeys : []
}

const hasFieldModelKeys = (field = {}) => getFieldModelKeys(field).length > 0

const cloneValue = (value) => {
  if (Array.isArray(value)) return [...value]
  if (value && typeof value === 'object') return { ...value }
  return value
}

const getDefaultValue = (field = {}) => {
  if (field.defaultValue !== undefined) return cloneValue(field.defaultValue)
  if (field.type === 'Array') return []

  switch (field.component) {
    case 'selectForm':
      return field.multiple ? [] : ''
    case 'groupSelectForm':
      return ['', '']
    case 'datepickerForm':
      return field.type === 'daterange' ? [] : ''
    case 'cascaderForm':
      return field.multiple ? [] : ''
    case 'checkboxGroupForm':
      return []
    case 'linkageSelectForm':
      return {}
    case 'deadlineForm':
      return field.defaultValue ?? 15
    case 'uploadPictureForm':
      return []
    default:
      return ''
  }
}

const getModelKeyDefaultValue = (field = {}, key = '') => {
  const defaultValue = field.defaultValue
  if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue) && defaultValue[key] !== undefined) {
    return cloneValue(defaultValue[key])
  }
  return ''
}

const normalizeField = (field = {}) => ({
  component: field.component,
  type: field.type,
  label: field.label || field.key || '',
  key: field.key,
  options: field.options || [],
  request: field.request || null,
  rules: field.rules || [],
  show: field.show !== false,
  labelWidth: field.labelWidth || props.labelWidth,
  ...field
})

const createInitialModel = (fields = [], source = {}) => {
  return fields.reduce((model, field) => {
    const modelKeys = getFieldModelKeys(field)
    if (modelKeys.length > 0) {
      modelKeys.forEach((key) => {
        model[key] = source[key] !== undefined ? cloneValue(source[key]) : getModelKeyDefaultValue(field, key)
      })
      model[field.key] = modelKeys.reduce((result, key) => {
        result[key] = model[key]
        return result
      }, {})
      return model
    }

    model[field.key] = source[field.key] !== undefined ? cloneValue(source[field.key]) : getDefaultValue(field)
    return model
  }, {})
}

const getComponentValue = (field = {}) => {
  const modelKeys = getFieldModelKeys(field)
  if (modelKeys.length === 0) return ruleForm.value[field.key]

  return modelKeys.reduce((result, key) => {
    result[key] = ruleForm.value[key] ?? ''
    return result
  }, {})
}

const setComponentValue = (field = {}, value) => {
  const modelKeys = getFieldModelKeys(field)
  if (modelKeys.length === 0) {
    ruleForm.value[field.key] = value
    return
  }

  modelKeys.forEach((key) => {
    ruleForm.value[key] = value?.[key] ?? ''
  })
  ruleForm.value[field.key] = modelKeys.reduce((result, key) => {
    result[key] = ruleForm.value[key]
    return result
  }, {})
}

const isSameValue = (source, target) => {
  return JSON.stringify(source || {}) === JSON.stringify(target || {})
}

const getFieldsSignature = (fields = []) => {
  return JSON.stringify(fields.map((field = {}) => ({
    component: field.component,
    key: field.key,
    modelKeys: field.modelKeys || [],
    type: field.type,
    multiple: field.multiple,
    lazy: field.lazy,
    firstShow: field.firstShow,
    firstDisabled: field.firstDisabled,
    secondDisabled: field.secondDisabled,
    first: field.first || null,
    second: field.second || null,
    options: field.options || [],
    request: field.request || null
  })))
}

const initForm = async () => {
  failedOptionRequestMap.clear()
  formFields.value = props.fields.map(normalizeField).filter((field) => field.key && field.component)
  const nextModel = createInitialModel(formFields.value, props.modelValue || {})
  if (!isSameValue(nextModel, ruleForm.value)) {
    ruleForm.value = nextModel
  }
  await loadAllOptions()
}

const rules = computed(() => {
  return formFields.value.reduce((result, field) => {
    if (hasFieldModelKeys(field)) {
      getFieldModelKeys(field).forEach((key) => {
        if (field.rules?.[key]) {
          result[key] = field.rules[key]
        }
      })
      if (Array.isArray(field.rules) && field.rules.length > 0) {
        result[field.key] = field.rules
      }
      return result
    }

    if (field.rules && field.rules.length > 0) {
      result[field.key] = field.rules
    }
    return result
  }, {})
})

const getRequestConfig = (field = {}, requestIndex = 0) => {
  return Array.isArray(field.request) ? field.request[requestIndex] : field.request
}

const OPTION_COMPONENTS = new Set([
  'selectForm',
  'groupSelectForm',
  'groupRadioForm',
  'checkboxGroupForm',
  'cascaderForm',
  'linkageSelectForm',
  'autocompleteForm'
])

const isOptionField = (field = {}) => OPTION_COMPONENTS.has(field.component)

const createOptionRequestKey = (field = {}, request = {}, extraParam = {}, requestIndex = 0) => {
  return JSON.stringify({
    key: field.key,
    requestIndex,
    url: request.url,
    method: request.method || 'get',
    param: { ...(request.param || {}), ...extraParam }
  })
}

const isSuccessResponse = (response) => {
  return SUCCESS_CODES.includes(Number(response?.code))
}

const setOptions = (field, options, requestIndex = 0) => {
  if (field.component === 'groupSelectForm') {
    const current = Array.isArray(optionsMap.value[field.key]?.[0]) ? [...optionsMap.value[field.key]] : [[], []]
    current[requestIndex] = options
    optionsMap.value[field.key] = current
    return
  }

  optionsMap.value[field.key] = options
}

const loadOptions = async (field = {}, extraParam = {}, requestIndex = 0, options = {}) => {
  const request = getRequestConfig(field, requestIndex)
  const shouldSetOptions = options.setOptions !== false
  const staticOptions = field.component === 'groupSelectForm' && Array.isArray(field.options?.[requestIndex])
    ? field.options[requestIndex]
    : field.options

  if (staticOptions && staticOptions.length > 0 && requestIndex === 0) {
    const options = normalizeOptions(staticOptions, request || {})
    if (shouldSetOptions) setOptions(field, options, requestIndex)
    return options
  }

  if (!request || !request.url) {
    if (shouldSetOptions) setOptions(field, [], requestIndex)
    return []
  }

  const requestKey = createOptionRequestKey(field, request, extraParam, requestIndex)
  if (failedOptionRequestMap.has(requestKey)) {
    return failedOptionRequestMap.get(requestKey)
  }

  if (optionRequestMap.has(requestKey)) {
    return optionRequestMap.get(requestKey)
  }

  loadingMap.value[field.key] = true
  const requestPromise = (async () => {
    const response = await submitItem(
      request.url,
      request.method || 'get',
      { ...(request.param || {}), ...extraParam },
      { keepEmptyKeys: request.keepEmptyKeys || [] }
    )
    if (!isSuccessResponse(response)) {
      const options = []
      failedOptionRequestMap.set(requestKey, options)
      if (shouldSetOptions) setOptions(field, options, requestIndex)
      return options
    }

    const options = normalizeOptions(getOptionData(response, request), request)
    if (shouldSetOptions) setOptions(field, options, requestIndex)
    return options
  })()

  optionRequestMap.set(requestKey, requestPromise)
  try {
    return await requestPromise
  } catch {
    if (shouldSetOptions) setOptions(field, [], requestIndex)
    return []
  } finally {
    optionRequestMap.delete(requestKey)
    loadingMap.value[field.key] = false
  }
}

const loadAllOptions = async () => {
  loading.value = true
  try {
    const optionFields = formFields.value.filter((field) => {
      return !field.lazy && isOptionField(field) && ((field.options && field.options.length > 0) || field.request)
    })
    await Promise.all(optionFields.map((field) => loadOptions(field)))
  } finally {
    loading.value = false
  }
}

watch(() => getFieldsSignature(props.fields), initForm, { immediate: true })

watch(() => props.modelValue, (value) => {
  const nextModel = createInitialModel(formFields.value, value || {})
  if (!isSameValue(nextModel, ruleForm.value)) {
    ruleForm.value = nextModel
  }
}, { deep: true })

watch(ruleForm, (value) => {
  if (!isSameValue(value, props.modelValue)) {
    emit('update:modelValue', { ...value })
  }
}, { deep: true })

const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (valid) {
    emit('submit', { ...ruleForm.value })
  }
}

const resetForm = () => {
  ruleForm.value = createInitialModel(formFields.value)
  nextTick(() => {
    formRef.value?.clearValidate()
  })
  emit('reset', { ...ruleForm.value })
}

defineExpose({
  submitForm,
  resetForm,
  clearValidate: () => formRef.value?.clearValidate(),
  validate: () => formRef.value?.validate()
})
</script>

<style scoped lang="scss">
.demo-form {
  margin: 2em 5em 0;
  .class-component{
    width: 100%;
    text-align: left;
  }
  .class-form-button {
    padding-top: 15px;
    :deep(.el-form-item__content) {
      width: 100%;
      justify-content: flex-end !important;
    }
    .el-button {
      padding: 4px 35px;
    }
  }
}
</style>
