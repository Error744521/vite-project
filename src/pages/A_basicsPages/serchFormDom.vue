<template>
  <div class="register-body-container">
    <div class="form-header">
      <h2>注册表单</h2>
      <p>使用动态表单组件进行主体信息注册</p>
      <el-button type="primary" @click="switchFn"> 切换</el-button>
    </div>
    <div class="form-wrapper">
      <search-form v-model="formModel" :groups="searchGroups" @search="handleSubmit" @reset="handleSubmit" />
    </div>
    <div class="form-preview">
      <h3>表单数据预览</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import SearchForm from '@views/Components/searchModule/index.vue'
import { ref, onMounted } from 'vue'

const searchGroups = ref([
  { label: '输入类型', fields: ['company_name', 'industry_id', 'area_id', 'area_ids'] },
  { label: '选中类型', fields: ['org_id', 'target_type', 'company_status', 'company_type_ids', 'inclusion_mode'] },
  { label: '日期类型', fields: ['area_ids', 'create_at', 'time_period', 'updateDate', 'time_type'] },
  { label: '单/复 型', fields: ['send_flag', 'rang_flag', 'supervision', 'live_auth_type', 'live_delivery_method'] },
  { label: '主播类型', fields: ['live_user_cate'] },
  { label: '带货品类', fields: ['live_goods_cate'] },
])
const formModel = ref({})
const formData = ref({})
const handleSubmit = (data) => {
  formData.value = data
  alert('表单验证通过！\n\n' + JSON.stringify(data, null, 2))
}

const switchFn = () => {
  searchGroups.value = [
    { label: '', fields: ['company_name'] },
    { label: '风险信息', fields: ['industry_id', 'company_status', 'company_type_ids', 'time_type'] },
    { label: '筛选信息', fields: ['org_id', 'target_type', 'area_ids', 'create_at', 'time_period'] },
    { label: '数据条件', fields: ['inclusion_mode', 'rang_flag', 'send_flag', 'supervision', 'live_auth_type', 'live_delivery_method'] },
    { label: '主播类型', fields: ['live_user_cate'] },
    { label: '带货品类', fields: ['live_goods_cate'] },
  ]
}

onMounted(() => {

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
