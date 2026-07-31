<template>
  <el-form ref="refForm" v-loading="loading" :model="ruleForm" :rules="rules" :label-width="labelWidth" class="demo-form">
    <div v-for="(item, index) in listForm" :key="index">
      <el-form-item :label="item.show ? item.label : ''" :prop="item.key">
        <component :is="getComponent(item.component)" v-model="ruleForm[item.key]" :attributes="item" />
      </el-form-item>
    </div>
    <el-form-item label="" class="class-form-button">
      <el-button @click="resetForm" :icon="Refresh">重置</el-button>
      <el-button type="primary" @click="submitForm" :icon="Finished">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Finished, Refresh } from '@element-plus/icons-vue'
import components from './index.js'

const emit = defineEmits(['setCallback', 'update:modelValue'])
const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
    description: '字段配置数组，包含完整的字段定义'
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const refForm = ref(null)
const ruleForm = ref({})
const loading = ref(false)
const listForm = ref([])
const labelWidth = ref('20em')

const getComponent = (name) => components[name]

const getDefaultValue = (item) => {
  if (!item) return ''
  switch (item.component) {
    case 'inputForm': return ''
    case 'textareaForm': return ''
    case 'selectForm': return item.multiple ? [] : ''
    case 'groupSelectForm': return ['', '']
    case 'groupRadioForm': return ''
    case 'datepickerForm': return item.type === 'daterange' ? [] : ''
    case 'cascaderForm': return item.multiple ? [] : ''
    case 'autocompleteForm': return ''
    case 'uploadFileForm': return ''
    case 'uploadPictureForm': return []
    default: return ''
  }
}

const initForm = (fields) => {
  ruleForm.value = {}
  listForm.value = []
  fields.forEach(field => {
    const config = {
      component: field.component,
      type: field.type,
      label: field.label,
      key: field.key,
      rules: field.rules || [],
      show: field.show !== false,
      labelWidth: field.labelWidth || labelWidth.value,
      ...field
    }
    ruleForm.value[field.key] = props.modelValue[field.key] ?? getDefaultValue(config)
    listForm.value.push(config)
  })
}

const rules = computed(() => {
  const result = {}
  listForm.value.forEach(item => {
    if (item.rules) {
      result[item.key] = item.rules
    }
  })
  return result
})

watch(() => props.fields, (val) => {
  if (val && val.length > 0) {
    initForm(val)
  }
}, { immediate: true })

watch(() => props.modelValue, (val) => {
  if (val && Object.keys(val).length > 0) {
    Object.keys(val).forEach(key => {
      if (ruleForm.value[key] !== undefined) {
        ruleForm.value[key] = val[key]
      }
    })
  }
}, { deep: true })

watch(ruleForm, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })

const submitForm = async () => {
  if (!refForm.value) return
  await refForm.value.validate((valid) => {
    if (valid) {
      emit('setCallback', { ...ruleForm.value })
    }
  })
}

const resetForm = () => {
  if (!refForm.value) return
  refForm.value.resetFields()
  Object.keys(ruleForm.value).forEach(key => {
    const item = listForm.value.find(item => item.key === key)
    ruleForm.value[key] = getDefaultValue(item)
  })
}

onMounted(() => {
  if (props.fields && props.fields.length > 0) {
    initForm(props.fields)
  }
})
</script>

<style scoped lang="scss">
.demo-form {
  margin-right: 15em;
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
