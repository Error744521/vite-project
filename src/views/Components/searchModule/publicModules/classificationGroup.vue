<template>
  <div class="class-group-flex">
    <ul :class="['formFlex-list', expanded ? 'formFlex-show' : 'formFlex-hide']">
      <li
        v-for="item in displayOptions"
        :key="item.value"
        :class="[field.type === 'String' ? 'colorR' : '', isActive(item.value) ? activeClass : '']"
        @click="changeClick(item)"
      >
        {{item.label}}
      </li>
    </ul>
    <p class="operationBtn" @click="expanded = !expanded">
      {{expanded ? '收回' : '展开'}}
      <i v-if="expanded" class="iconfont icon-up"></i>
      <i v-else class="iconfont icon-down"></i>
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { isMultipleField } from './fieldProps.js'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  field: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const expanded = ref(false)
const activeClass = computed(() => (isMultipleField(props.field) ? 'activeB' : 'activeR'))
const displayOptions = computed(() => [{ label: '全部', value: '' }, ...props.options])

const isActive = (value) => {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(value)
  return props.modelValue === value
}

const changeClick = (item) => {
  if (!isMultipleField(props.field)) {
    emit('update:modelValue', item.value)
    emit('change', item.value)
    return
  }

  if (item.value === '') {
    emit('update:modelValue', [''])
    emit('change', [''])
    return
  }

  const nextValue = Array.isArray(props.modelValue) ? props.modelValue.filter((value) => value !== '') : []
  const index = nextValue.indexOf(item.value)
  if (index === -1) {
    nextValue.push(item.value)
  } else {
    nextValue.splice(index, 1)
  }

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<style scoped lang="scss">
.class-group-flex {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  .formFlex-list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    padding: 3px 0 3px 3px;
    li {
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 5px $grey-dark;
      cursor: pointer;
      line-height: 30px;
      padding: 0 10px;
      margin: 0 15px 10px 0;
      font-size: 14px;
      color: $black-color;
      min-width: 80px;
      text-align: center;
    }
    li:hover {
      color: $mainPrimary;
    }
    li.activeB {
      color: $white;
      box-shadow: 0 0 5px $mainPrimaryHex;
      background-color: $mainPrimaryHex;
    }
    .colorR:hover {
      color: $red-dark;
    }
    li.activeR {
      color: $white !important;
      box-shadow: 0 0 5px $red-light;
      background-color: $red-light;
    }
  }
  .formFlex-show {
    height: auto !important;
    overflow: auto;
    animation: grow 0.8s;
  }
  .formFlex-hide {
    height: 32px;
    overflow: hidden;
    animation: closed 0.8s;
  }
  @keyframes grow {
    from {
      height: 32px;
      overflow: hidden;
    }
    to {
      height: auto !important;
      overflow: auto;
    }
  }
  @keyframes closed {
    from {
      height: auto;
      overflow: auto;
    }
    to {
      height: 32px;
      overflow: hidden;
    }
  }
  .operationBtn {
    width: 60px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    cursor: pointer;
    color: $mainPrimary;
    .icon-down {
      position: relative;
      top: 2px;
    }
  }
}
</style>
