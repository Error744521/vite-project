<template>
  <DialogDom :title="'密码修改'" :visible="visible" :showFooter="true" :confirmText="'提交'" :cancelText="'重置'"
             @confirm="onSubmit" @update:visible="emit('update:visible', $event)" class="custom-dialog">
    <template #content>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" class="assignment-form" label-width="120px">
        <el-form-item label="新密码" prop="new_password">
          <el-input type="password" placeholder="请设置新密码(6-16个字符，仅可为字母、数字!)" oninput="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" maxlength="16" v-model="ruleForm.new_password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" placeholder="请确认新密码(6-16个字符，仅可为字母、数字!)" oninput="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" maxlength="16" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </DialogDom>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { submitItem } from '@/api/index.js'
import { ElMessage } from "element-plus";
import DialogDom from '@/components/base/dialogDom.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const ruleFormRef = ref(null)

const ruleForm = reactive({
  new_password: '',
  checkPass: ''
})

const rules = reactive({
  new_password: [
    { required: true, message: '请设置新密码', trigger: 'blur' },
    { min: 6, max: 18, message: '请设定6-18位有效数字', trigger: 'blur' }
  ],
  checkPass: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: newPasswordValidator, trigger: 'blur' }
  ]
})

function newPasswordValidator (rule, value, callback) {
  if (value !== ruleForm.new_password) {
    callback(new Error('与新密码不一致!'))
  } else {
    callback()
  }
}

const onSubmit = async () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      submitItem('/v1/users/resetpwd', 'post', ruleForm).then(res => {
        if (res.code === 200) {
          ElMessage({ message: '修改密码成功！', type: 'success' })
          emit('update:visible', false)
          resetForm()
        } else {
          ElMessage({ message: res.msg, type: 'warning' })
        }
      })
    }
  })
}

const resetForm = () => {
  ruleForm.new_password = ''
  ruleForm.checkPass = ''
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
}

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped lang="scss">
.custom-dialog {
  .el-dialog__header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color);
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .el-dialog__body {
    padding: 20px;
    min-height: 100px;
  }

  .el-dialog__footer {
    padding: 16px 20px;
    border-top: 1px solid var(--el-border-color);
  }
}

.dialog-body {
  width: 100%;
  box-sizing: border-box;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.assignment-form {
  padding: 20px 40px 0 !important;
  max-height: 400px;
  overflow-y: auto;
}
</style>
