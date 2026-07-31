<template>
  <header class="page_header flex">
    <div class="flex-left" v-if="props.type === 1">
      <span class="text-icon">
        <i class="iconfont icon-Template"></i>
      </span>
      <span class="text-large">详情</span>
    </div>
    <div class="flex-left" v-if="props.type === 2">
      <span class="text-back" @click="onBack"><i class="iconfont iconleftArrow"></i>返回</span>
      <span class="text-large">详情</span>
      <span class="text-sm">主体</span>
    </div>
    <div class="flex-left" v-if="props.type === 3">
      <span class="text-line"></span>
      <span class="text-large">详情</span>
    </div>
    <div class="flex-right">
      <el-button v-for="(item, index) in btnlist" :color="item.color" :key="index" :icon="item.icon" :type="item.type" plain
                 @click="btnClick(index + 1, item.param)">{{item.text}}</el-button>
    </div>
  </header>
</template>
<script setup>
import { ArrowLeft, Grid, DocumentCopy, UploadFilled, Plus, Pointer, Delete, CopyDocument } from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

const router = useRouter()
const emit = defineEmits(['callback'])
const props = defineProps({
  type: {
    type: String,
    default: () => {}
  },
  param: {
    icon: String,
    title: String,
    subtitle: String
  },
  features: {
    linkTem: { type: Object | Array, default: () => {} },
    linkImpor: { type: Object | Array, default: () => {} },
    linkExport: { type: Object | Array, default: () => {} },
    addItem: { type: Object | Array, default: () => {} },
    dispatch: { type: Object | Array, default: () => {} },
    assignment: { type: Object | Array, default: () => {} },
    deleteItem: { type: Object | Array, default: () => {} },
    labeling: { type: Object | Array, default: () => {} },
  }
})
const btnlist = shallowRef([
  { text: '下载模板', type: 'text', color: '#666', icon: '', param: props.features.linkTem },
  { text: '导入', type: '', color: '#409EFF', icon: 'UploadFilled', param: props.features.linkImpor },
  { text: '导出', type: '', color: '#909399', icon: 'DocumentCopy', param: props.features.linkExport },
  { text: '新增', type: '', color: '#E6A23C', icon: 'Plus', param: props.features.addItem },
  { text: '指派', type: '', color: '#CE67ADE5', icon: 'Pointer', param: props.features.dispatch },
  { text: '分派', type: '', color: '#485efa', icon: 'Guide', param: props.features.assignment },
  { text: '删除', type: '', color: '#F56C6C', icon: 'Delete', param: props.features.deleteItem },
  { text: '批量打标', type: '', color: '#67C23A', icon: 'CopyDocument', param: props.features.labeling },
])

const btnClick = (param, type) => {
  if (type === 1) {
    window.open(param)
  }
  if (type === 2) {

  }
}

const onBack = () => {
  router.go(-1)
}

onMounted(() => {

})
</script>

<style scoped lang="scss">
.page_header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid $white;
}
.flex-left {
  width: auto;
  text-align: left;
  @include flexwrap(nowrap);
  align-items: center;
  .text-icon {
    display: flex;
    align-items: center;
    color: $mainPrimary;
    i.iconfont {
      @include Pstyle(6);
    }
  }
  .text-icon-back {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: $black-color;
  }
  .text-icon-back:hover {
    color: $mainPrimary;
  }
  .text-line {
    display: inline-block;
    height: 20px;
    width: 5px;
    background: $mainPrimary;
  }
  .text-back {
    @include Pstyle(4);
    margin-left: 10px;
    position: relative;
    color: $black-light;
    display: flex;
    align-items: center;
    i.iconfont {
      @include Pstyle(6);
      position: relative;
      left: -5px;
    }
  }
  .text-back::after {
    content: ' ';
    display: inline-block;
    width: 3px;
    height: 20px;
    margin-right: 10px;
    background: $black-light;
    position: relative;
    top: 0;
    left: 10px;
  }
  .text-large,
  .text-sm {
    @include Pstyle(4);
    color: $black-color;
    margin-left: 10px;
  }
}
.flex-right {
  flex: 1;
  text-align: right;
}
</style>
