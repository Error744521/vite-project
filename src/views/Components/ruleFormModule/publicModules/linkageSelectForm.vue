<template>
  <div class="linkage-select">
    <el-select
      v-if="firstShow"
      :model-value="currentValue[firstKey]"
      :disabled="field.firstDisabled || field.disabled"
      :loading="firstLoading"
      :filterable="field.first?.filterable"
      clearable
      :placeholder="field.first?.placeholder || '请选择'"
      @change="handleFirstChange"
    >
      <el-option v-for="item in firstOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <el-select
      :model-value="currentValue[secondKey]"
      :disabled="field.secondDisabled || field.disabled"
      :loading="secondLoading"
      :filterable="field.second?.filterable"
      clearable
      :placeholder="field.second?.placeholder || '请选择'"
      @change="handleSecondChange"
    >
      <el-option v-for="item in secondOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  field: { type: Object, default: () => ({}) },
  loadOptions: { type: Function, default: null }
})
const emit = defineEmits(['update:modelValue'])

const firstOptions = ref([])
const secondOptions = ref([])
const firstLoading = ref(false)
const secondLoading = ref(false)

const modelKeys = computed(() => props.field.modelKeys || [])
const firstKey = computed(() => modelKeys.value[0] || 'first')
const secondKey = computed(() => modelKeys.value[1] || 'second')
const firstShow = computed(() => props.field.firstShow !== false)
const currentValue = computed(() => ({
  [firstKey.value]: props.modelValue?.[firstKey.value] ?? '',
  [secondKey.value]: props.modelValue?.[secondKey.value] ?? ''
}))

const createRequestField = (config = {}, key) => ({
  ...props.field,
  key,
  options: config.options || [],
  request: config.request || null
})

const requestOptions = async (config = {}, key, extraParam = {}) => {
  if (!props.loadOptions) return []
  return props.loadOptions(createRequestField(config, key), extraParam, 0, { setOptions: false })
}

const loadFirstOptions = async () => {
  firstLoading.value = true
  try {
    firstOptions.value = await requestOptions(props.field.first, `${props.field.key}_first`)
  } finally {
    firstLoading.value = false
  }
}

const loadSecondOptions = async (value = '') => {
  secondLoading.value = true
  try {
    const request = props.field.second?.request || {}
    const param = request.key ? { [request.key]: value || '' } : {}
    secondOptions.value = await requestOptions(props.field.second, `${props.field.key}_second`, param)
  } finally {
    secondLoading.value = false
  }
}

const emitValue = (value) => {
  emit('update:modelValue', {
    [firstKey.value]: value[firstKey.value] ?? '',
    [secondKey.value]: value[secondKey.value] ?? ''
  })
}

const handleFirstChange = async (value) => {
  emitValue({
    [firstKey.value]: value,
    [secondKey.value]: ''
  })
  await loadSecondOptions(value)
}

const handleSecondChange = (value) => {
  emitValue({
    ...currentValue.value,
    [secondKey.value]: value
  })
}

watch(() => props.field.firstDisabled, async (disabled) => {
  if (disabled) {
    firstOptions.value = []
    await loadSecondOptions()
  } else {
    secondOptions.value = []
    await loadFirstOptions()
  }
}, { immediate: true })

watch(() => currentValue.value[firstKey.value], (value) => {
  if (!props.field.firstDisabled && value) loadSecondOptions(value)
}, { immediate: true })
</script>

<style scoped lang="scss">
.linkage-select {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  width: 100%;
}
</style>
