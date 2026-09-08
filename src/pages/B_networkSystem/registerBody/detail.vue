<template>
  <div class="index-content-page">
    <div class="page-header-sticky">
      <page-secondary-header title="主体详情" :sub-title="subTitle" />
    </div>
    <div class="module_card">
      <div class="data-detail-header">
        <DataDetailHeader :data="itemData" @update:image="handleImageUpdate" @marking-success="getDetail"></DataDetailHeader>
      </div>
      <div class="data-detail-tab">
        <TabsComponents :data="componentList" @changeTabs="handleChangeTabs"></TabsComponents>
      </div>
      <div class="data-detail-content">
        <component :is="activeComponent" v-if="activeComponent" :itemData="itemData" :type="5" @callback="getDetail"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { submitItem } from '@/api/index.js'
import components from '@views/ComponentsPages/index.js'
import DataDetailHeader from '@views/ComponentsPages/dataDetailHeader.vue'
import TabsComponents from '@views/ComponentsPages/tabsComponents.vue'
const route = useRoute()
const detailId = computed(() => route.params.id)
const subTitle = computed(() => route.params.id ? `主体ID：${route.params.id}` : '主体信息')

const componentName = ref('companyContent')
const itemData = ref({})

const activeComponent = computed(() => components[componentName.value] || null)

const componentList = [
  { type: 0, label: '基本信息', num: 0, moduleName: 'companyContent' },
  { type: 1, label: '许可信息', num: 0, moduleName: 'licenseContent' },
  { type: 2, label: '网络载体', num: 0, moduleName: 'knowledgeProperty' },
  { type: 3, label: '投诉举报', num: 0, moduleName: 'complaintReport' },
  { type: 4, label: '列严列异', num: 0, moduleName: 'legalAction' },
  { type: 5, label: '双随机', num: 0, moduleName: 'randomAction' },
  { type: 6, label: '行政处罚', num: 0, moduleName: 'adminStrative' },
  { type: 7, label: '其他', num: 0, moduleName: 'othersModule' }
]

const getDetail = async () => {
  if (!detailId.value) return
  const response = await submitItem(`/v1/companies/${detailId.value}`, 'get', {})
  if (response.code === 200) {
    itemData.value = response.data || {}
  }
}

const handleChangeTabs = (item) => {
  componentName.value = item?.moduleName || item || 'companyContent'
}

const handleImageUpdate = (url) => {
  itemData.value = {
    ...itemData.value,
    image_path: url
  }
}

watch(detailId, getDetail)
onMounted(getDetail)
</script>

<style scoped lang="scss">
.index-content-page {
  padding: 0 5px;
  overflow: auto;
  background-color: $white;
  &::-webkit-scrollbar {
    display: none;
  }
  .data-detail-header{
    margin: 20px 10px;
  }
  .data-detail-tab{
    margin: 30px 20px 20px;
  }
  .data-detail-content{
    margin: 10px;
  }
}
.page-header-sticky {
  padding-top: 5px;
  position: sticky;
  top: 0;
  z-index: 20;
}
</style>
