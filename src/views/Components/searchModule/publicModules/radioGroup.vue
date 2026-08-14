<template>
  <el-form-item :label="fieldLabel(field)" :prop="field.key">
    <el-radio-group :model-value="modelValue" @update:model-value="changeInput" class="class-padding-p-line">
      <template v-if="field.type === 'radio'">
        <el-radio v-for="item in options" :key="item.value" :value="item.value">{{item.label}}</el-radio>
      </template>
      <template v-if="field.type === 'button'">
        <el-radio-button v-for="item in options" :key="item.value" :value="item.value">
          <span class="class-radio-button">{{item.label}}</span>
        </el-radio-button>
      </template>
    </el-radio-group>
  </el-form-item>
</template>

<script setup>
import { fieldLabel } from './fieldProps.js'
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
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
const changeInput = (param) => {
  emit('update:modelValue', param)
  emit('change', param)
}
</script>

<style scoped lang="scss">
.class-radio-button{
  display: inline-block;
  min-width: 80px;
}
</style>
