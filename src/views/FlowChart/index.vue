<template>
  <div class="index-content-page">
    <div class="module_page">
      <Diagram class="container" />
    </div>
  </div>
</template>

<script setup>
import Diagram from './Diagram.vue'
</script>

<style scoped lang="scss">.module_page { background: #fff9; padding: 20px; overflow: auto; height: calc(100% - 40px); .module_card { margin-top: 10px; } .container { width: 100%; height: 100%; } }</style>
