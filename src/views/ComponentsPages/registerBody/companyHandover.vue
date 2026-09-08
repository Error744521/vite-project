<script setup>
import DialogDom from '@/components/base/dialogDom.vue'
import RuleFormModule from '@views/Components/ruleFormModule/index.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '填写主体信息'
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'update:modelValue', 'submit', 'reset', 'close'])

const defaultFormModel = () => ({
  company_name: '',
  credit_code: '',
  area_ids: '',
  company_address: '',
  registration_authority: ''
})

const formModel = ref(defaultFormModel())

const isSameValue = (source, target) => {
  return JSON.stringify(source || {}) === JSON.stringify(target || {})
}

const formFields = computed(() => [
  {
    component: 'inputForm',
    type: 'text',
    label: '主体名称',
    key: 'company_name',
    maxlength: 100,
    placeholder: '请输入主体名称'
  },
  {
    component: 'inputForm',
    type: 'text',
    label: '统一社会信用代码',
    key: 'credit_code',
    maxlength: 18,
    placeholder: '请输入统一社会信用代码',
    rules: [
      { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
      { min: 1, max: 18, message: '字符长度为1-18', trigger: 'blur' }
    ]
  },
  {
    component: 'cascaderForm',
    type: 'string',
    label: '所属地区',
    key: 'area_ids',
    options: [],
    lazy: true,
    checkStrictly: true,
    emitPath: false,
    leafLevel: 2,
    width: '100%',
    placeholder: '请选择',
    request: { url: '/v1/jurisdiction/area-options', method: 'get', param: {}, key: 'parent_id', label: 'area_name', value: 'id', level: 'area_level' },
    rules: [{ required: true, message: '请选择所属地区', trigger: 'change' }]
  },
  {
    component: 'inputForm',
    type: 'text',
    label: '主体地址',
    key: 'company_address',
    placeholder: '请输入主体地址'
  },
  {
    component: 'inputForm',
    type: 'text',
    label: '登记机关',
    key: 'registration_authority',
    placeholder: '请输入登记机关'
  }
])

watch(() => props.modelValue, (value) => {
  const nextModel = {
    ...defaultFormModel(),
    ...(value || {})
  }
  if (!isSameValue(nextModel, formModel.value)) {
    formModel.value = nextModel
  }
}, {
  immediate: true,
  deep: true
})

watch(formModel, (value) => {
  if (!isSameValue(value, props.modelValue)) {
    emit('update:modelValue', { ...value })
  }
}, {
  deep: true
})

const handleSubmit = (data) => {
  emit('submit', data)
}

const handleReset = (data) => {
  formModel.value = { ...data }
  emit('reset', data)
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <dialog-dom :visible="visible" :title="title" :loading="loading" width="50%" :show-footer="false" @close="handleClose"
    @update:visible="emit('update:visible', $event)"
  >
    <template #content>
        <div class="company-handover__tips">
          <p>如果主体是自然人，主体名称填写姓名 统一社会信用代码 填写 身份证号码</p>
        </div>
        <rule-form-module v-model="formModel" :fields="formFields" label-width="25%" reset-text="重置" submit-text="提交" @submit="handleSubmit" @reset="handleReset"/>
    </template>
  </dialog-dom>
</template>

<style scoped lang="scss">

.company-handover__tips {
  margin: 0 5em;
  p{
    width: 75%;
    padding: 10px 20px;
    margin-left: 25%;
    box-sizing: border-box;
    color: $black-color;
    font-size: 14px;
    line-height: 24px;
    background-color: $grey-light;
    border-radius: 3px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
  }
}
</style>
