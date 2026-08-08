<template>
  <el-dialog :title="title" v-model="dialogVisible" :width="width" :top="top" :modal="modal" :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape" :show-close="showClose" :before-close="handleBeforeClose" class="custom-dialog">
    <div class="dialog-body">
      <slot name="content"></slot>
    </div>
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer" v-if="showFooter">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  visible: {
    type: Boolean,
    default: false
  },
  width: {
    type: [String, Number],
    default: '600px'
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'close', 'resetForm', 'onSubmit', 'open'])

const dialogVisible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    emit('open')
  }
})

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

const handleBeforeClose = (done) => {
  done()
}

const handleCancel = () => {
  dialogVisible.value = false
  emit('resetForm')
}

const handleConfirm = () => {
  emit('confirm')
}
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
  padding: 10px 40px;
  button{
    padding: 0 40px;
  }
}
</style>
