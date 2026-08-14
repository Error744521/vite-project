<template>
  <el-form ref="formRef" v-loading="loading" :model="ruleForm" :rules="rules" :label-width="labelWidth" class="demo-form">
    <el-form-item v-for="field in formFields" :key="field.key" :label="field.show ? field.label : ''" :prop="field.key">
      <component class="class-component" :is="getComponent(field.component)"
        v-model="ruleForm[field.key]" :field="field" :options="optionsMap[field.key] || []" :loading="loadingMap[field.key] || false" :load-options="loadOptions"/>
    </el-form-item>
    <el-form-item label="" class="class-form-button">
      <el-button @click="resetForm" :icon="Refresh">重置</el-button>
      <el-button type="primary" @click="submitForm" :icon="Finished">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { Finished, Refresh } from '@element-plus/icons-vue'
import { submitItem } from '@/api/index.js'
import { normalizeOptions } from '@/api/useFieldOptions.js'
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
  }
})

const formRef = ref(null)
const ruleForm = ref({})
const loading = ref(false)
const loadingMap = ref({})
const optionsMap = ref({})
const formFields = ref([])

const labelWidth = computed(() => props.labelWidth)

const getComponent = (name) => components[name]

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
    case 'uploadPictureForm':
      return []
    default:
      return ''
  }
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
    model[field.key] = source[field.key] !== undefined ? cloneValue(source[field.key]) : getDefaultValue(field)
    return model
  }, {})
}

const initForm = async () => {
  formFields.value = props.fields.map(normalizeField).filter((field) => field.key && field.component)
  ruleForm.value = createInitialModel(formFields.value, props.modelValue || {})
  await loadAllOptions()
}

const rules = computed(() => {
  return formFields.value.reduce((result, field) => {
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
  'cascaderForm',
  'autocompleteForm'
])

const isOptionField = (field = {}) => OPTION_COMPONENTS.has(field.component)

const setOptions = (field, options, requestIndex = 0) => {
  if (field.component === 'groupSelectForm') {
    const current = Array.isArray(optionsMap.value[field.key]?.[0]) ? [...optionsMap.value[field.key]] : [[], []]
    current[requestIndex] = options
    optionsMap.value[field.key] = current
    return
  }

  optionsMap.value[field.key] = options
}

const loadOptions = async (field = {}, extraParam = {}, requestIndex = 0) => {
  const request = getRequestConfig(field, requestIndex)
  const staticOptions = field.component === 'groupSelectForm' && Array.isArray(field.options?.[requestIndex])
    ? field.options[requestIndex]
    : field.options

  if (staticOptions && staticOptions.length > 0 && requestIndex === 0) {
    const options = normalizeOptions(staticOptions, request || {})
    setOptions(field, options, requestIndex)
    return options
  }

  if (!request || !request.url) {
    setOptions(field, [], requestIndex)
    return []
  }

  loadingMap.value[field.key] = true
  try {
    const response = await submitItem(request.url, request.method || 'get', { ...(request.param || {}), ...extraParam })
    const options = normalizeOptions(response?.data || [], request)
    setOptions(field, options, requestIndex)
    return options
  } catch {
    setOptions(field, [], requestIndex)
    return []
  } finally {
    loadingMap.value[field.key] = false
  }
}

const loadAllOptions = async () => {
  loading.value = true
  try {
    const optionFields = formFields.value.filter((field) => {
      return isOptionField(field) && ((field.options && field.options.length > 0) || field.request)
    })
    await Promise.all(optionFields.map((field) => loadOptions(field)))
  } finally {
    loading.value = false
  }
}

watch(() => props.fields, initForm, { deep: true, immediate: true })

watch(() => props.modelValue, (value) => {
  ruleForm.value = createInitialModel(formFields.value, value || {})
}, { deep: true })

watch(ruleForm, (value) => {
  emit('update:modelValue', { ...value })
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
  margin: 2em 5em;
  .class-component{
    width: 100%;
    text-align: left;
  }
  .class-form-button {
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
