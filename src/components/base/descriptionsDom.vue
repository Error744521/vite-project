<template>
  <div class="descriptions-box" :class="{ 'descriptions-border': border }">
    <div class="descriptions-header" v-if="title">
      <span class="descriptions-title">{{ title }}</span>
    </div>
    <div class="descriptions-body">
      <el-descriptions :column="column" :direction="direction" :size="size" :border="border" :colon="colon">
        <el-descriptions-item
          v-for="item in list"
          :key="item.prop"
          :label="item.label"
          :span="item.span || 1"
          label-class-name="my-label"
          content-class-name="my-content"
        >
          <template #label>
            <slot :name="`label-${item.prop}`" :row="row" :item="item">{{ item.label }}</slot>
          </template>
          <template #default>
            <slot :name="item.prop" :row="row" :item="item" :value="getValue(item, row)">
              <span
                class="descriptions-value"
                :class="{ 'is-clickable': item.clickable }"
                @click="handleItemClick(item)"
              >
                {{ getValue(item, row) }}
              </span>
            </slot>
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  row: {type: Object, default: () => ({})},
  list: {type: Array, default: () => []},
  title: {type: String, default: ''},
  column: {type: Number, default: 3},
  direction: {type: String, default: 'horizontal'},
  size: {type: String, default: 'default'},
  border: {type: Boolean, default: true},
  colon: {type: Boolean, default: true}
})
const emit = defineEmits(['item-click'])
const getValue = (item, row) => {
  if (item.formatter && typeof item.formatter === 'function') {
    return item.formatter(row)
  }
  const value = row[item.prop]
  return value === '' || value === null || value === undefined ? '--' : value
}
const handleItemClick = (item) => {
  if (!item.clickable) return
  emit('item-click', {
    item,
    row: props.row,
    value: getValue(item, props.row)
  })
}
</script>

<style scoped lang="scss">
.descriptions-box {
  .descriptions-header {
    padding: 0 0 12px 0;
    .descriptions-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  .descriptions-body {
    :deep(.my-label) {
      width: 120px;
      background-color: #fafafa;
      color: var(--el-text-color-secondary);
    }
    :deep(.my-content) {
      max-width: 300px;
      word-break: break-word;
    }
    .descriptions-value {
      color: var(--el-text-color-primary);
      display: inline-block;

      &.is-clickable {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
  }
  &.descriptions-border {
    .descriptions-body {
      padding: 12px;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
    }
  }
}
</style>
