<template>
  <div class="page-secondary-header">
    <el-page-header :title="backText" @back="onBack">
      <template #content>
        <div class="page-secondary-header__content">
          <span class="page-secondary-header__title">{{ title }}</span>
          <span v-if="subTitle" class="page-secondary-header__subtitle">{{ subTitle }}</span>
        </div>
      </template>
      <template v-if="$slots.extra" #extra>
        <div class="page-secondary-header__extra">
          <slot name="extra"></slot>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, default: '页面详情' },
  subTitle: { type: String, default: '' },
  backText: { type: String, default: '返回' },
  backPath: { type: String, default: '' }
})
const emit = defineEmits(['back'])
const router = useRouter()

const onBack = () => {
  emit('back')
  if (props.backPath) {
    router.push(props.backPath)
    return
  }
  router.back()
}
</script>

<style scoped lang="scss">
.page-secondary-header {
  padding: 12px 16px;
  background: $white;
  border-bottom: 1px solid var(--el-border-color-light);

  &__content,
  &__extra {
    display: flex;
    align-items: center;
  }

  &__title {
    color: var(--el-text-color-primary);
    font-size: 16px;
    font-weight: 600;
  }

  &__subtitle {
    margin-left: 10px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
