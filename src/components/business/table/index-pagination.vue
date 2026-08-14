<template>
  <div class="pro-table__pagination">
    <el-pagination
        v-model:current-page="currentPageModel"
        v-model:page-size="pageSizeModel"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="props.total"
        :page-sizes="props.pageSizes"  :layout="props.paginationLayout" :background="props.paginationBackground" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: {
    type: [Number, String],
    default: () => {}
  },
  pageSize: {
    type: [Number, String],
    default: () => {}
  },
  total: {
    type: Number,
    default: 0
  },
  pageSizes: {
    type: Array,
    default: () => ([15, 30, 50, 100, 200])
  },
  paginationLayout: {
    type: String,
    default: () => ('sizes, total,  prev, pager, next, jumper')
  },
  paginationBackground: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:page', 'update:pageSize', 'size-change', 'current-change'])

const currentPageModel = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

const handleCurrentChange = (page) => {
  emit('current-change', page, 'page')
}

const handleSizeChange = (size) => {
  emit('size-change', size, 'size')
}


</script>

<style scoped lang="scss"></style>
