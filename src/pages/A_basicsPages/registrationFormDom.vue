<template>
  <div class="register-body-container">
    <div class="form-header">
      <h2>注册表单</h2>
      <p>使用动态表单组件进行主体信息注册</p>
    </div>

    <div class="form-wrapper">
      <rule-form :fields="formFields" v-model="formData" @setCallback="handleSubmit" />
    </div>

    <div class="form-preview">
      <h3>表单数据预览</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import RuleForm from '@views/Components/ruleFormModule/index.vue'
import ObjectForm from '@views/Components/ruleFormModule/public.js'
import {ref, computed, onMounted} from 'vue'

const formData = ref({company_name: '12321', category_id: [2, 22]})
const formFields = computed(() => {
  console.log('ObjectForm:', ObjectForm)
  const fields = Object.entries(ObjectForm).map(([key, config]) => ({...config, key: key}))
  console.log('formFields:', fields)
  return fields
})
const handleSubmit = (data) => {
  console.log('表单提交:', data)
  alert('表单验证通过！\n\n' + JSON.stringify(data, null, 2))
}
onMounted(() => {
  console.log('表单字段数量:', formFields.value.length)
})
</script>

<style scoped lang="scss">
.register-body-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.form-header {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  h2 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #303133;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #606266;
  }
}
.debug-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #fffbe6;
  border-radius: 8px;
  border: 1px solid #ffe58f;
  h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #d48806;
  }
  p {
    margin: 0 0 8px 0;
    font-size: 13px;
  }
  pre {
    margin: 0;
    padding: 12px;
    background: #fff;
    border-radius: 4px;
    font-size: 12px;
    max-height: 150px;
    overflow-y: auto;
  }
}
.form-wrapper {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.form-preview {
  margin-top: 20px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #303133;
  }
  pre {
    margin: 0;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
    font-size: 13px;
    overflow-x: auto;
  }
}
</style>
