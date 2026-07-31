<template>
<div>
  <div class="toolbar-item" :class="{'selection-active': selectionOpened}" @click="$_selectionSelect()">
    <area-select size="18" />
  </div>
  <div class="toolbar-item" @click="$_zoomIn()">
    <zoom-in size="18" />
  </div>
  <div class="toolbar-item" @click="$_zoomOut()">
    <zoom-out size="18" />
  </div>
  <div class="toolbar-item" :class="{'disabled': !undoAble}" @click="$_undo()">
    <step-back size="18" />
  </div>
  <div class="toolbar-item" :class="{'disabled': !redoAble}" @click="$_redo()">
    <step-foward size="18" />
  </div>
  <div style="margin-left: 5px; flex: 1">
    <el-select v-model="linetype" size="mini" @change="$_changeLineType">
      <el-option v-for="item in lineOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </div>
  <div>
    <button style="width: 42px;margin: 0 6px;" @click="$_saveGraph">保存</button>
  </div>
</div>
</template>

<script>
import ZoomIn from './icon/ZoomIn.vue'
import ZoomOut from './icon/ZoomOut.vue'
import StepBack from './icon/StepBack.vue'
import StepFoward from './icon/StepFoward.vue'
import AreaSelect from './icon/AreaSelect.vue'
export default {
  props: {
    lf: Object,
    activeEdges: Array,
    fillColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectionOpened: false,
      undoAble: false,
      redoAble: false,
      colors: '#345678',
      linetype: 'pro-polyline',
      lineOptions: [
        {
          value: 'pro-polyline',
          label: '折线'
        },
        {
          value: 'pro-line',
          label: '直线'
        },
        {
          value: 'pro-bezier',
          label: '曲线'
        }
      ]
    }
  },
  mounted () {
    this.$props.lf.on('history:change', ({ data: { undoAble, redoAble } }) => {
      this.$data.redoAble = redoAble
      this.$data.undoAble = undoAble
    })
  },
  methods: {
    $_changeFillColor (val) {
      this.$emit('changeNodeFillColor', val.hex)
    },
    $_saveGraph () {
      this.$emit('saveGraph')
    },
    $_zoomIn () {
      this.$props.lf.zoom(true)
    },
    $_zoomOut () {
      this.$props.lf.zoom(false)
    },
    $_undo () {
      if (this.$data.undoAble) {
        this.$props.lf.undo()
      }
    },
    $_redo () {
      if (this.$data.redoAble) {
        this.$props.lf.redo()
      }
    },
    $_selectionSelect () {
      this.selectionOpened = !this.selectionOpened
      if (this.selectionOpened) {
        this.lf.extension.selectionSelect.openSelectionSelect()
      } else {
        this.lf.extension.selectionSelect.closeSelectionSelect()
      }
    },
    $_changeLineType(value) {
      const {lf, activeEdges} = this.$props
      const {graphModel} = lf
      lf.setDefaultEdgeType(value)
      if(activeEdges && activeEdges.length > 0) {
        activeEdges.forEach(edge => {
          graphModel.changeEdgeType(edge.id, value)
        })
      }
    }
  },
  components: {
    ZoomIn,
    ZoomOut,
    StepBack,
    StepFoward,
    AreaSelect
  }
}
</script>

<style scoped>
.toolbar-item {
  width: 18px;
  height: 18px;
  float: left;
  margin: 12px 4px;
  cursor: pointer;
}
.toolbar-color-picker {
  width: 24px;
  height: 24px;
  margin: 8px 4px;
}
.selection-active {
  background: #33a3dc;
}
</style>
