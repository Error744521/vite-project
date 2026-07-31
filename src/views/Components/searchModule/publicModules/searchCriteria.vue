<template>
  <div class="class-flex">
    <p class="class-flex-title" v-show="searchCriteria.length > 0">筛选条件：</p>
    <ul class="class-flex-centent ellipsis">
      <li v-for="(item, index) in searchCriteria" :key="index">{{item.value}}<span>|</span></li>
    </ul>
  </div>
</template>

<script setup>
import { useFormStore } from "@/store/formation.js";
const store = useFormStore()
const searchCriteria = ref([])
const props = defineProps({
  attributes: {
    type: Object,
    default: () => {}
  },
})
watch(() => store.searchCondition.length, (newVal, oldVal) => {
  if (newVal === 0) {
    searchCriteria.value = []
  } else {
    searchCriteria.value = store.getSearchCondition
  }
})

onMounted(() => {
  searchCriteria.value = store.getSearchCondition || []
})
</script>

<style scoped lang="scss">
.class-flex{
  display: flex;
  flex-wrap: wrap;
  .class-flex-title{
    width: 90px;
    line-height: 30px;
    color: $black-light;
    font-size: 14px;
    letter-spacing: 2px;
  }
  .class-flex-centent{
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    overflow-x: auto;
    li{
      line-height: 30px;
      margin-right: 5px;
      color: $black-light;
      font-size: 14px;
      span{
        margin-left: 5px;
        color: $mainPrimary;
      }
    }
    li:nth-last-child(1) span{
      display: none;
    }
  }
  .class-flex-centent::-webkit-scrollbar{
    display: none;
  }
}
</style>
