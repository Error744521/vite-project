<template>
  <div class="class-search" v-loading="loading">
    <span class="iconScreening" @click="handleOpen(switchKG)">
      <i :class="['iconfont', switchKG ? 'icon-menu-up' : 'icon-menu-down']"></i>
    </span>
    <el-form :model="formModel" :inline="true" :label-width="props.width" :class="[switchKG ? 'demo-form-inline' : 'demo-form-block']">
      <div class="formFlex" v-for="(group, index) in normalizedGroups" :key="index">
        <p class="formFlex-label" v-if="group.label">{{ group.label }}：</p>
        <div class="formFlex-list" v-if="group.fields && group.fields.length > 0">
          <p class="p-line" v-for="field in group.fields" :key="field.key">
            <component :is="getComponent(field.component)" v-model="formModel[field.key]" :field="field" :options="optionsMap[field.key] || []" :loading="loadingMap[field.key] || false" :load-options="loadOptions" @change="handleFieldChange(field, $event)"/>
          </p>
        </div>
      </div>
    </el-form>
    <div class="class-search-btn">
      <searchCriteria class="flexWidth" :items="criteriaList"></searchCriteria>
      <el-form-item label="" class="flexForm">
        <el-button type="primary" @click="onSubmit" :icon="Search">搜索</el-button>
        <el-button @click="onRefresh" :icon="Refresh">重置</el-button>
      </el-form-item>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import components from './index.js'
import searchCriteria from './publicModules/searchCriteria.vue'
import searchFormFn from '@views/Components/searchModule/public.js'
import { buildCriteriaList } from './core/searchCriteria.js'
import { flattenSearchGroups, normalizeSearchConfig } from './core/normalizeSearchConfig.js'
import { buildSearchParams, createInitialModel } from './core/searchValue.js'
import { loadFieldOptions } from './core/searchOptions.js'

const emit = defineEmits(['search', 'reset', 'change', 'update:modelValue'])
const getComponent = (name) => components[name]
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  groups: { type: Array, default: () => [] },
  width: { type: String, default: '' },
  show: { type: Boolean, default: false },
  keys: { type: String, default: () => 'public' }
})
const loading = ref(false)
const loadingMap = ref({})
const switchKG = ref(false)
const normalizedGroups = ref([])
const fields = ref([])
const formModel = ref({})
const optionsMap = ref({})
const criteriaList = ref([])

const onSubmit = () => {
  const params = { ...buildSearchParams(formModel.value, fields.value), page: 1, pagesize: 15 }
  emit('update:modelValue', { ...formModel.value })
  emit('search', params)
}

const onRefresh = () => {
  formModel.value = createInitialModel(fields.value)
  criteriaList.value = []
  const params = { page: 1, pagesize: 15 }
  emit('update:modelValue', { ...formModel.value })
  emit('reset', params)
}

const handleOpen = (status) => {
  switchKG.value = !status
}

const loadFormFields = async () => {
  const ObjectForm = await searchFormFn(props.keys)
  normalizedGroups.value = normalizeSearchConfig({
    groups: props.groups,
    fieldMap: ObjectForm,
    labelShow: props.show,
    labelWidth: props.width
  })
  fields.value = flattenSearchGroups(normalizedGroups.value)
  formModel.value = { ...createInitialModel(fields.value), ...props.modelValue }
  await loadAllOptions()
  updateCriteria()
}

const loadOptions = async (field, extraParam = {}) => {
  loadingMap.value[field.key] = true
  try {
    const options = await loadFieldOptions(field, extraParam)
    optionsMap.value[field.key] = options
    return options
  } catch {
    optionsMap.value[field.key] = []
    return []
  } finally {
    loadingMap.value[field.key] = false
  }
}

const loadAllOptions = async () => {
  loading.value = true
  try {
    const initFields = fields.value.filter((field) => field.component !== 'cascaderLazy')
    await Promise.all(initFields.map((field) => loadOptions(field)))
  } finally {
    loading.value = false
  }
}

const updateCriteria = () => {
  criteriaList.value = buildCriteriaList(formModel.value, fields.value, optionsMap.value)
}

const handleFieldChange = (field, value) => {
  formModel.value[field.key] = value
  updateCriteria()
  emit('update:modelValue', { ...formModel.value })
  emit('change', { field, value, model: { ...formModel.value } })
}

watch(() => props.modelValue, (value) => {
  formModel.value = { ...createInitialModel(fields.value), ...(value || {}) }
  updateCriteria()
}, { deep: true })

watch([() => props.keys, () => props.groups], loadFormFields, { immediate: true })
</script>

<style scoped lang="scss">
@use './index.scss';

</style>
