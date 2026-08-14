<template>
  <svg v-if="iconClass" aria-hidden="true" class="svg-icon" :style="iconStyle" :fill="color || 'currentColor'">
    <use :href="symbolId" :xlink:href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  iconClass: {
    type: String,
    required: false,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: [String, Number],
    default: '1em'
  }
})

const formatSize = (size) => {
  return typeof size === 'number' ? `${size}px` : size
}

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)
const iconStyle = computed(() => {
  const size = formatSize(props.size)
  return {
    width: size,
    height: size
  }
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  outline: none;
  fill: currentcolor;
}
</style>
