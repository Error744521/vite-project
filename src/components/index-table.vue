<template>
  <div class="pro-table-wrapper">
    <el-table ref="tableRef" v-loading="props.loading"
      :data="tableData"
      :show-header="props.params.showHeader"
      :border="props.params.border"
      :stripe="props.params.stripe"
      :highlight-current-row="props.params.highlightCurrentRow"
      :empty-text="props.params.emptyText"
      :row-key="rowKey"
      :show-overflow-tooltip="props.params.showOverflowTooltip"
      :header-cell-class-name="params.headerCellClassName"
      :cell-class-name="params.cellClassName"
      :row-class-name="params.rowClassName"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @cell-click="handleCellClick"
      @expand-change="handleExpandChange"
    >
      <el-table-column v-if="props.params.selection" type="selection" width="55" align="center" :reserve-selection="reserveSelection" :selectable="selectable" />
      <el-table-column v-if="props.params.showIndex" type="index" label="序号" width="60" align="center" :index="getIndexMethod" />
      <el-table-column v-if="props.params.expand" type="expand" width="50">
        <template #default="scope">
          <slot name="expand" :row="scope.row" :$index="scope.$index"></slot>
        </template>
      </el-table-column>
      <template v-for="column in columns" :key="column.prop">
        <el-table-column :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
          :label-class-name="column.className" :class-name="column.className"
          :fixed="column.fixed" :sortable="column.sortable"
          :align="column.align || 'left'"
          :header-align="column.headerAlign"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :formatter="column.formatter"
        >
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row" :column="column" :$index="scope.$index"></slot>
          </template>
          <template v-else-if="column.render" #default="scope">
            <component :is="column.render(scope.row, scope.$index)" />
          </template>
          <template v-else-if="column.type" #default="scope">
            <template v-if="column.type === 'image'">
              <el-image :src="scope.row[column.prop]" :preview-src-list="[scope.row[column.prop]]" :style="{ width: column.imageWidth || '50px', height: column.imageHeight || '50px' }" fit="cover" />
            </template>
            <template v-else-if="column.type === 'tag'">
              <el-tag :type="getTagType(scope.row[column.prop], column.tagMap)">{{formatValue(scope.row[column.prop], column.tagMap) }}</el-tag>
            </template>
            <template v-else-if="column.type === 'link'">
              <el-link underline="never" type="primary" @click="handleLinkClick(scope.row, column)">{{scope.row[column.prop] }}</el-link>
            </template>
            <template v-else-if="column.type === 'date'">{{formatDate(scope.row[column.prop], column.dateFormat || 'YYYY-MM-DD') }}</template>
          </template>
        </el-table-column>
      </template>
      <template #empty>
        <slot name="empty">
          <el-empty :description="params.emptyText" />
        </slot>
      </template>
    </el-table>
    <index-pagination v-if="props.meta.pagination"
      :page="props.meta.page" :pageSize="props.meta.pageSize"
      :total="props.meta.total"
      @update:page="props.meta.page = $event"
      @update:pageSize="props.meta.pageSize = $event"
      @size-change="$emit('callback', 'size', $event)"
      @current-change="$emit('callback', 'page', $event)"
    />
  </div>
</template>

<script setup>
import {useFormStore} from '@/store/formation.js'
import { formatDate as formatDateUtil } from '@/utils/tools.js'
const store = useFormStore()

const props = defineProps({
  loading: {type: Boolean, default: false},
  tableData: {type: Array, default: () => []},
  columns: {type: Array, default: () => []},
  params: {
    type: Object,
    default: () => {}
  },
  meta: {
    type: Object,
    default: () => {}
  },
  rowKey: {type: [String, Function], default: 'id'},
  reserveSelection: {type: Boolean, default: false},
  selectable: {type: Function, default: null}
})
const emit = defineEmits(['callback', 'sort-change', 'row-click', 'row-dblclick', 'cell-click', 'expand-change', 'link-click'])
const params = ref({
  rowClassName: 'rowClassName',
  cellClassName: 'cellClassName', //单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
  headerCellClassName: 'headerCellClassName' //表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
 })
const tableRef = ref(null)
const getIndexMethod = (index) => { return (props.meta.page - 1) * props.meta.pageSize + index + 1 }
const handleSelectionChange = (selection) => {
  const arr = selection.map((item) => item.id)
  store.setSelectionMultiple(arr)
}
onMounted(() => {
  store.clearRuleForm()
})
const handleLinkClick = (row, column) => {
  if (!row[column.prop]) return false
  window.open(row[column.prop])
  emit('link-click', row, column)
}
const handleSortChange = ({column, prop, order}) => {
  emit('sort-change', {column, prop, order})
}
const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}
const handleRowDblclick = (row, column, event) => {
  emit('row-dblclick', row, column, event)
}
const handleCellClick = (row, column, cell, event) => {
  emit('cell-click', row, column, cell, event)
}
const handleExpandChange = (row, expandedRows) => {
  emit('expand-change', row, expandedRows)
}
const getTagType = (value, tagMap) => {
  if (!tagMap) return ''
  const item = tagMap.find((t) => t.value === value)
  return item?.type || ''
}
const formatValue = (value, tagMap) => {
  if (!tagMap) return value
  const item = tagMap.find((t) => t.value === value)
  return item?.label || value
}
const formatDate = (value, format) => {
  if (!value) return ''
  return formatDateUtil(value, format)
}
const clearSelection = () => { //用于多选表格，清空用户的选择
  tableRef.value?.clearSelection()
}
const clearSort = () => { //用于清空排序条件，数据会恢复成未排序的状态
  tableRef.value?.clearSort()
}
const scrollTo = (left, top) => { //滚动到一组特定坐标
   tableRef.value?.scrollTo(left, top)
}
defineExpose({clearSelection, clearSort, scrollTo, tableRef})
</script>

<style scoped lang="scss">
.el-table {
  :deep(.headerCellClassName) {
    background-color: $white-light !important;
    color: $black-color;
  }
  :deep(.rowEllipsis .cell) {
    a {
      width: 100%;
      span {
        width: 100%;
        display: inline-block;
        white-space: nowrap; /* 确保内容在一行内显示 */
        overflow: hidden; /* 隐藏超出容器的内容 */
        text-overflow: ellipsis; /* 内容超出时显示省略号 */
      }
    }
  }
  :deep(.row120 .cell) {
  }
  :deep(.row140 .cell) {
  }
}
:deep(.icon-size) {
  /* table td icon size */
  width: 1em;
  height: 1em;
}
:deep(.class-more-font-style) {
  /* table el-bottom 更多style */
  cursor: pointer;
  display: inline-block;
  margin-left: 10px;
  font-size: 15px;
  position: relative;
  top: 2px;
  color: $blue-light;
  &:hover {
    color: $mainPrimaryHex;
  }
}
.pro-table-wrapper {
  padding: 5px 10px;
  .pro-table__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .pro-table__search {
    flex: 1;
    min-width: 200px;
  }
  .pro-table__toolbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .pro-table__pagination {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }
}
</style>
