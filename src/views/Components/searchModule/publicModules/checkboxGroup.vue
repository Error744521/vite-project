<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key" >
    <el-checkbox-group :model-value="modelValue" @update:model-value="changeInput" class="class-padding-p-line">
      <template v-if="field.type === 'checkbox'">
        <el-checkbox v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-checkbox>
      </template>
      <template v-if="field.type === 'button'">
        <el-checkbox-button v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          <span class="class-radio-button">{{item.label}}</span>
        </el-checkbox-button>
      </template>
    </el-checkbox-group>
  </el-form-item>
</template>

<script setup>
import { fieldLabel } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  field: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const changeInput = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.class-radio-button{
  display: inline-block;
  min-width: 80px;
}
</style>
