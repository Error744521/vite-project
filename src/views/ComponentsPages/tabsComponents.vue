<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['changeTabs'])
const activeKey = ref('')

const getTabKey = (item, index) => {
  return String(item?.moduleName ?? item?.type ?? index)
}

const getTabLabel = (item) => {
  return item?.label || item?.title || item?.name || item?.tage || ''
}

const handleTabClick = (item, index) => {
  activeKey.value = getTabKey(item, index)
  emit('changeTabs', item)
}

watch(() => props.data, (list) => {
  activeKey.value = list.length > 0 ? getTabKey(list[0], 0) : ''
}, {
  immediate: true
})
</script>

<template>
  <div v-if="data.length > 0" class="tabs-components">
    <button
      v-for="(item, index) in data"
      :key="getTabKey(item, index)"
      :class="['tabs-components__item', { 'is-active': activeKey === getTabKey(item, index) }]"
      type="button"
      @click="handleTabClick(item, index)"
    >
      {{ getTabLabel(item) }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.tabs-components {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border: 1px solid $mainPrimary;
  background-color: $grey-light;
  box-sizing: border-box;
}

.tabs-components__item {
  height: 38px;
  padding: 0 12px;
  color: $black-dark;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
  background-color: $white-light;
  border: 0;
  border-right: 1px solid $mainPrimary;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;

  &:last-child {
    border-right: 0;
  }

  &:hover,
  &.is-active {
    color: $mainPrimary;
      background-color: $white;
  }
}

</style>
