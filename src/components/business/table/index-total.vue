<template>
  <div class="index_total">
    <p>共 {{ totalData.total || 0 }} 条数据,</p>
    <p v-if="totalData.show" @click="jumpTo">异常数据 {{ loading ? '加载中' : number }} 条</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { submitItem } from '@/api/index.js'

const router = useRouter()
const props = defineProps({
  totalData: {
    type: Object,
    default: () => ({})
  }
})

const number = ref(0)
const loading = ref(false)

const jumpTo = () => {
  const pageUrl = props.totalData?.pageUrl || props.totalData?.goPage?.url
  if (pageUrl) {
    router.push(pageUrl)
  }
}

const loadNumber = async () => {
  const request = props.totalData?.request || props.totalData?.goPage?.request
  if (!props.totalData?.show || !request?.url) {
    number.value = 0
    return
  }

  loading.value = true
  try {
    const res = await submitItem(request.url, request.method || 'get', request.param || {})
    number.value = res.code === 200 ? res.data : 0
  } catch {
    number.value = 0
  } finally {
    loading.value = false
  }
}

watch(() => props.totalData, loadNumber, { immediate: true, deep: true })

</script>

<style scoped lang="scss">
.index_total {
  flex: 1;
  @include flexwrap(nowrap);
  p {
    margin-left: 10px;
    color: $black-color;
    @include Pstyle(2);
  }
  p:nth-child(2) {
    color: $mainPrimary;
    cursor: pointer;
  }
}
</style>
