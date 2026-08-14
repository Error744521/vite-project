<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :top="top"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="handleBeforeClose"
    class="custom-dialog"
    @open="emit('open')"
    @close="emit('close')"
  >
    <div class="dialog-body">
      <slot name="content"></slot>
    </div>
    <template v-if="hasFooter" #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button :disabled="loading" @click="handleCancel">{{ cancelText }}</el-button>
          <el-button type="primary" :loading="loading" :disabled="loading" @click="handleConfirm">{{ confirmText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, useSlots } from 'vue'

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

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'open', 'close'])
const slots = useSlots()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value)
  }
})

const hasFooter = computed(() => Boolean(slots.footer) || props.showFooter)

const handleBeforeClose = (done) => {
  if (props.loading) return
  done()
}

const handleCancel = () => {
  if (props.loading) return
  emit('cancel')
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (props.loading) return
  emit('confirm')
}
</script>

<style scoped lang="scss">
:global(.custom-dialog .el-dialog__header) {
  border-bottom: 1px solid var(--el-border-color);
  text-align: left;
  padding-left: 15px;
}

:global(.custom-dialog .el-dialog__body) {
  padding: 20px 20px 10px 20px;
  min-height: 100px;
  height: auto;
  max-height: 70vh;
  overflow: auto;
}

:global(.custom-dialog .el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color);
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
