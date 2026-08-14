<template>
  <teleport to="body">
    <div v-if="visible" class="image-preview-mask" @click.self="handleClose">
      <div class="image-preview-container">
        <div class="preview-header">
          <span class="preview-title">图片预览</span>
          <span class="preview-index">{{ hasImages ? currentIndex + 1 : 0 }} / {{ images.length }}</span>
          <el-icon class="close-btn" @click="handleClose"><Close /></el-icon>
        </div>

        <div class="preview-main">
          <div v-if="hasImages && images.length > 1" class="preview-toolbar left" :class="{ disabled: !canPrev }" @click="handlePrev">
            <el-icon :size="32" class="nav-icon"><ChevronLeft /></el-icon>
          </div>

          <div class="preview-area" @wheel.prevent="handleWheel">
            <div
              v-if="hasImages"
              class="image-wrapper"
              :style="imageStyle"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
            >
              <img :src="currentImage" :alt="`图片 ${currentIndex + 1}`" class="preview-image" draggable="false" />
            </div>
            <el-empty v-else description="暂无图片" />
          </div>

          <div v-if="hasImages && images.length > 1" class="preview-toolbar right" :class="{ disabled: !canNext }" @click="handleNext">
            <el-icon :size="32" class="nav-icon"><ChevronRight /></el-icon>
          </div>
        </div>

        <div v-if="hasImages" class="preview-footer">
          <div class="zoom-controls">
            <el-button size="small" icon="Minus" @click="handleZoomOut" :disabled="scale <= 0.25">缩小</el-button>
            <span class="zoom-value">{{ Math.round(scale * 100) }}%</span>
            <el-button size="small" icon="Plus" @click="handleZoomIn" :disabled="scale >= 5">放大</el-button>
            <el-button size="small" icon="Refresh" @click="handleReset">重置</el-button>
          </div>

          <div class="rotate-controls">
            <el-button size="small" icon="RotateLeft" @click="handleRotate(-90)">左旋转</el-button>
            <el-button size="small" icon="RotateRight" @click="handleRotate(90)">右旋转</el-button>
          </div>

          <div v-if="images.length > 1" class="indicator-dots">
            <span
              v-for="(img, index) in images"
              :key="index"
              class="dot"
              :class="{ active: index === currentIndex }"
              @click="goToImage(index)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import {Close, ChevronLeft, ChevronRight} from '@element-plus/icons-vue'

const props = defineProps({
  visible: {type: Boolean, default: false},
  images: {type: Array, default: () => []},
  initialIndex: {type: Number, default: 0}
})
const emit = defineEmits(['update:visible', 'change'])
const currentIndex = ref(props.initialIndex)
const scale = ref(1)
const rotate = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
let bodyOverflow = ''

const hasImages = computed(() => props.images.length > 0)
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < props.images.length - 1)
const currentImage = computed(() => {
  if (!hasImages.value) return ''
  const img = props.images[currentIndex.value]
  return typeof img === 'string' ? img : img.url || img.src || img.preview || ''
})
const imageStyle = computed(() => {
  return {transform: `scale(${scale.value}) rotate(${rotate.value}deg) translate(${translateX.value}px, ${translateY.value}px)`}
})

const getSafeIndex = (index) => {
  if (!hasImages.value) return 0
  return Math.min(Math.max(index, 0), props.images.length - 1)
}

watch(() => props.visible, (val) => {
  if (val) {
    currentIndex.value = getSafeIndex(props.initialIndex)
    handleReset()
    lockBodyScroll()
  } else {
    unlockBodyScroll()
  }
}, { immediate: true })
watch(() => props.initialIndex, (val) => {
  currentIndex.value = getSafeIndex(val)
})
watch(() => props.images.length, () => {
  currentIndex.value = getSafeIndex(currentIndex.value)
})
const handleClose = () => {
  emit('update:visible', false)
}
const handlePrev = () => {
  if (canPrev.value) {
    currentIndex.value--
    resetPosition()
    emit('change', currentIndex.value)
  }
}
const handleNext = () => {
  if (canNext.value) {
    currentIndex.value++
    resetPosition()
    emit('change', currentIndex.value)
  }
}
const goToImage = (index) => {
  currentIndex.value = getSafeIndex(index)
  resetPosition()
  emit('change', currentIndex.value)
}
const handleZoomIn = () => {
  if (scale.value < 5) {
    scale.value = Math.min(5, scale.value + 0.25)
  }
}
const handleZoomOut = () => {
  if (scale.value > 0.25) {
    scale.value = Math.max(0.25, scale.value - 0.25)
    if (scale.value <= 1) {
      resetPosition()
    }
  }
}
const handleReset = () => {
  scale.value = 1
  rotate.value = 0
  translateX.value = 0
  translateY.value = 0
}
const handleRotate = (degree) => {
  rotate.value += degree
}
const handleWheel = (e) => {
  if (!hasImages.value) return
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newScale = scale.value + delta
  if (newScale >= 0.25 && newScale <= 5) {
    scale.value = newScale
  }
}
const handleMouseDown = (e) => {
  if (scale.value > 1) {
    isDragging.value = true
    startX.value = e.clientX - translateX.value
    startY.value = e.clientY - translateY.value
  }
}
const handleMouseMove = (e) => {
  if (isDragging.value && scale.value > 1) {
    translateX.value = e.clientX - startX.value
    translateY.value = e.clientY - startY.value
  }
}
const handleMouseUp = () => {
  isDragging.value = false
}
const resetPosition = () => {
  translateX.value = 0
  translateY.value = 0
}

const handleKeydown = (event) => {
  if (!props.visible) return
  if (event.key === 'Escape') handleClose()
  if (event.key === 'ArrowLeft') handlePrev()
  if (event.key === 'ArrowRight') handleNext()
}

const lockBodyScroll = () => {
  bodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', handleKeydown)
}

const unlockBodyScroll = () => {
  document.body.style.overflow = bodyOverflow
  document.removeEventListener('keydown', handleKeydown)
}

onUnmounted(() => {
  unlockBodyScroll()
})
</script>

<style scoped lang="scss">
.image-preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.image-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
}
.preview-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #333;
  .preview-title {
    font-size: 16px;
    color: #fff;
    font-weight: 500;
  }
  .preview-index {
    margin-left: 16px;
    font-size: 14px;
    color: #999;
  }
  .close-btn {
    margin-left: auto;
    color: #999;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.3s;
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.preview-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.preview-toolbar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
  .nav-icon {
    color: #fff;
  }
}
.preview-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}
.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;
  transform-origin: center center;
}
.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}
.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid #333;
}
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  .zoom-value {
    min-width: 60px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
}
.rotate-controls {
  display: flex;
  gap: 8px;
}
.indicator-dots {
  display: flex;
  gap: 8px;
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s;
    &.active {
      background: #409eff;
      transform: scale(1.2);
    }
    &:hover {
      background: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
