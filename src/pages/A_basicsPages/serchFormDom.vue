<template>
  <div class="register-body-container">
    <div class="form-header">
      <h2>注册表单</h2>
      <p>使用动态表单组件进行主体信息注册</p>
      <el-button type="primary" @click="switchFn"> 切换</el-button>
    </div>
    <div class="form-wrapper">
      <search-form :formData="formFields" @setCallback="handleSubmit" />
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

const formFields = ref([
  { label: '输入类型', Options: { company_name: true, industry_id: true, area_id: true, area_ids: true } },
  { label: '选中类型', Options: { org_id: true, target_type: true, company_status: true, company_type_ids: true, inclusion_mode: true  } },
  { label: '日期类型', Options: { area_ids: true, create_at: true,  time_period: true,  updateDate: true, time_type: true, } },
  { label: '单/复 型', Options: { send_flag: true, rang_flag: true, supervision: true, live_auth_type: true, live_delivery_method: true, } },
  { label: '主播类型', Options: { live_user_cate: true, } },
  { label: '带货品类', Options: { live_goods_cate: true } },
])
//const formFields = ref( { inclusion_mode: true, rang_flag: true, send_flag: true, supervision: true, live_auth_type: true, live_delivery_method: true })
const formData = ref({})
const handleSubmit = (data) => {
  formData.value = data
  alert('表单验证通过！\n\n' + JSON.stringify(data, null, 2))
}

const switchFn = () => {
  formFields.value = [
    { label: '', Options: { company_name: true } },
    { label: '风险信息', Options: { industry_id: true, company_status: true, company_type_ids: true, time_type: true  } },
    { label: '筛选信息', Options: { org_id: true, target_type: true, area_ids: true, create_at: true, time_period: true } },
    { label: '数据条件', Options: { inclusion_mode: true, rang_flag: true, send_flag: true, supervision: true, live_auth_type: true, live_delivery_method: true, } },
    { label: '主播类型', Options: { live_user_cate: true, } },
    { label: '带货品类', Options: { live_goods_cate: true } },
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
