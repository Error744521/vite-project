<template>
  <div class="index_tatal">
    <p>共 {{ data.total }} 条数据,</p>
    <p v-if="data.request && data.pageUrl" @click="JumperTo">异常数据 {{ number }} 条</p>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()
const props = defineProps({
  data: {
    type: Object, default: () => {
    }
  }
})
const number = ref(0)
const JumperTo = () => {
  if (props.data && props.data.pageUrl) {
    router.push({path: props.data.pageUrl})
  }
}
onMounted(() => {
  if (props.data.request && props.data.request.url) {
    submitItem(props.data?.request.url, props.data?.request.method, {}).then((res) => {
      if (res.code === 200) {
        number.value = res.data
      }
    })
  }
})
</script>

<style scoped lang="scss">
.index_tatal {
  flex: 1;
  @include flexwrap(nowap);
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
