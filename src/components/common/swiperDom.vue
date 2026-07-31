<template>
  <div ref="swiperRef" :class="[className, { 'swiper-vertical': direction === 'vertical' }]">
    <div class="swiper-wrapper">
      <div v-for="(item, index) in slides" :key="item.id || index" class="swiper-slide">
        <slot name="slide" :item="item" :index="index"></slot>
      </div>
    </div>
    <div v-if="pagination" class="swiper-pagination"></div>
    <button v-if="navigation" :class="['swiper-button-prev', navClass]" aria-label="上一页"></button>
    <button v-if="navigation" :class="['swiper-button-next', navClass]" aria-label="下一页"></button>
    <div v-if="scrollbar" class="swiper-scrollbar"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { Swiper } from 'swiper'
import { Autoplay, Pagination, Navigation, Scrollbar, EffectCoverflow, EffectFlip, EffectCube, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-fade'

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  },
  slidesPerView: {
    type: [Number, String],
    default: 1
  },
  spaceBetween: {
    type: Number,
    default: 0
  },
  loop: {
    type: Boolean,
    default: false
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  autoplayDelay: {
    type: Number,
    default: 3000
  },
  pagination: {
    type: Boolean,
    default: false
  },
  navigation: {
    type: Boolean,
    default: false
  },
  navClass: {
    type: String,
    default: ''
  },
  scrollbar: {
    type: Boolean,
    default: false
  },
  effect: {
    type: String,
    default: 'slide',
    validator: (val) => ['slide', 'fade', 'cube', 'flip', 'coverflow'].includes(val)
  }
})

const emit = defineEmits([
  'slideChange',
  'transitionEnd',
  'click'
])

const swiperRef = ref(null)
let swiperInstance = null

const swiperModules = computed(() => {
  const modules = []

  if (props.autoplay) modules.push(Autoplay)
  if (props.pagination) modules.push(Pagination)
  if (props.navigation) modules.push(Navigation)
  if (props.scrollbar) modules.push(Scrollbar)
  if (props.effect === 'coverflow') modules.push(EffectCoverflow)
  if (props.effect === 'flip') modules.push(EffectFlip)
  if (props.effect === 'cube') modules.push(EffectCube)
  if (props.effect === 'fade') modules.push(EffectFade)

  return modules
})

const swiperOptions = computed(() => ({
  modules: swiperModules.value,
  slidesPerView: props.slidesPerView,
  spaceBetween: props.spaceBetween,
  loop: props.loop,
  autoplay: props.autoplay ? {
    delay: props.autoplayDelay,
    disableOnInteraction: false
  } : false,
  pagination: props.pagination ? { clickable: true } : false,
  navigation: props.navigation ? {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  } : false,
  scrollbar: props.scrollbar ? { draggable: true } : false,
  effect: props.effect
}))

const initSwiper = () => {
  if (swiperInstance) {
    swiperInstance.destroy()
  }

  nextTick(() => {
    const container = swiperRef.value
    if (!container) return

    swiperInstance = new Swiper(container, swiperOptions.value)

    swiperInstance.on('slideChange', () => {
      emit('slideChange', swiperInstance)
    })

    swiperInstance.on('transitionEnd', () => {
      emit('transitionEnd', swiperInstance)
    })

    swiperInstance.on('click', (swiper, event) => {
      emit('click', swiper, event)
    })
  })
}

watch(() => props.slides, () => {
  nextTick(() => {
    if (swiperInstance) {
      swiperInstance.update()
    }
  })
}, { deep: true })

onMounted(() => {
  initSwiper()
})

onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy(true, true)
    swiperInstance = null
  }
})

defineExpose({
  swiper: () => swiperInstance,
  slideTo: (index, speed) => swiperInstance?.slideTo(index, speed),
  slideNext: (speed) => swiperInstance?.slideNext(speed),
  slidePrev: (speed) => swiperInstance?.slidePrev(speed),
  update: () => swiperInstance?.update()
})
</script>

<style scoped lang="scss">
.swiper-container {
  width: 100%;
  height: 100%;

  &-vertical {
    .swiper-wrapper {
      flex-direction: column;
    }
  }
}
</style>
