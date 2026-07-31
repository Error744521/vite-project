<template>
  <dialog-dom :title="title" :visible="visible" :show-footer="showFooter" :confirm-text="confirmText" :cancel-text="cancelText"
    @confirm="handleConfirm" @cancel="handleCancel" @close="handleClose">
    <template #content>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" class="assignment-form">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="formData.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDesc">
          <el-textarea v-model="formData.taskDesc" placeholder="请输入任务描述" :rows="3" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="formData.priority" placeholder="请选择优先级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="指派人员" prop="assignee">
          <el-select v-model="formData.assignee" placeholder="请选择指派人员">
            <el-option v-for="user in userList" :key="user.id" :label="user.name" :value="user.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker v-model="formData.deadline" type="datetime" placeholder="请选择截止时间" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="待处理" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-textarea v-model="formData.remark" placeholder="请输入备注信息" :rows="2" />
        </el-form-item>
      </el-form>
    </template>
  </dialog-dom>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import dialogDom from '@/components/common/dialogDom.vue'

const props = defineProps({
  visible: { type: Boolean, default: true },
  title: { type: String, default: '数据指派' },
  showFooter: { type: Boolean, default: true },
  confirmText: { type: String, default: '提交' },
  cancelText: { type: String, default: '重置' },
  editData: {}
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'close'])

const formRef = ref()
const userList = ref([
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' }
])

const formData = reactive({
  taskName: '',
  taskDesc: '',
  priority: 'medium',
  assignee: '',
  deadline: '',
  status: 'pending',
  remark: ''
})

const rules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  assignee: [{ required: true, message: '请选择指派人员', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
}

watch(() => props.visible, (val) => {
  if (val && props.editData && Object.keys(props.editData).length > 0) {
    Object.assign(formData, props.editData)
  } else if (val) {
    resetForm()
  }
})

const resetForm = () => {
  formData.taskName = ''
  formData.taskDesc = ''
  formData.priority = 'medium'
  formData.assignee = ''
  formData.deadline = ''
  formData.status = 'pending'
  formData.remark = ''
  formRef.value?.resetFields()
}

const handleConfirm = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (valid) {
    emit('confirm', { ...formData })
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.assignment-form {
  max-height: 400px;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
