<script setup>
import DescriptionsDom from '@/components/base/descriptionsDom.vue'

const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  }
})

const displayIndex = computed(() => String(props.index + 1).padStart(2, '0'))

const getValue = (...keys) => {
  const value = keys.map((key) => props.row?.[key]).find((item) => item !== undefined && item !== null && item !== '')
  return value || '--'
}

const splitLabels = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return String(value).split(/[,，、\s]+/).filter(Boolean)
}

const labelList = computed(() => {
  const labels = splitLabels(props.row.label_names || props.row.tags_arr)
  return labels.length > 0 ? labels : []
})

const tagClassNames = [
  'is-new-data',
  'is-template',
  'is-unusual',
  'is-delete',
  'is-assignment',
  'is-dispatch',
  'is-unusual',
  'is-marking'
]

const tagList = computed(() => {
  const types = Array.isArray(props.row.types) ? props.row.types : []
  return [{ label: getValue('company_status_name'), value: '' }, ...types].map((tag, index) => ({
    ...tag,
    className: tagClassNames[index] || 'is-marking'
  }))
})

const descriptionList = computed(() => [
  {
    label: '统一信用代码',
    prop: 'credit_code',
    formatter: () => getValue('credit_code')
  },
  {
    label: '注册资本',
    prop: 'capital',
    formatter: () => getValue('capital')
  },
  {
    label: '法定代表人',
    prop: 'legal_person',
    formatter: () => getValue('legal_person')
  },
  {
    label: '成立日期',
    prop: 'establish_date',
    formatter: () => getValue('establish_date')
  },
  {
    label: '行业类型',
    prop: 'industry_name',
    formatter: () => getValue('industry_name')
  },
  {
    label: '所属地区',
    prop: 'area_name',
    formatter: () => `${getValue('province')} ${getValue('city')} ${getValue('county')}`
  },
  {
    label: '主体地址',
    prop: 'company_address',
    span: 3,
    formatter: () => getValue('company_address')
  }
])
</script>

<template>
  <div class="register-body-row">
    <div class="register-body-row__header">
        <div class="register-body-row__title">
          <span class="register-body-row__index">{{ displayIndex }}.</span>
          <span class="register-body-row__name">{{ getValue('company_name') }}</span>
          <el-tag v-for="tag in tagList" :key="tag.label" :class="['register-body-row__tag', tag.className]" effect="light" size="small">
            {{ tag.label }} {{ tag.value }}
          </el-tag>
          <p class="class-row-tips"><span>{{getValue('org_name')}}</span></p>
        </div>
        <div v-if="labelList.length > 0" class="register-body-row__labels">
          <el-link v-for="label in labelList" :key="label" type="primary" underline="never">{{ label }}</el-link>
        </div>
    </div>
    <div class="register-body-row__main">
      <div class="register-body-row__info">
        <DescriptionsDom :row="row" :list="descriptionList" :column="3" :border="false" size="small" />
      </div>
      <div class="register-body-row__score">
        <div class="register-body-row__score-item">
          <strong>{{ getValue('credit_level') }}</strong>
          <span>信用分级</span>
        </div>
        <div class="register-body-row__score-item">
          <strong>{{ getValue('risk_level') }}</strong>
          <span>风险评估</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.class-row-tips{
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: $s12;
  color: $mainPrimary;
}
.register-body-row {
  width: 100%;
  min-height: 120px;
  padding: 8px 0;
  color: $black-color;
}

.register-body-row__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.register-body-row__header{
  width: 100%;
}
.register-body-row__title {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 28px;
  flex-wrap: wrap;
}

.register-body-row__index {
  font-size: 20px;
  font-style: italic;
  font-weight: 700;
  color: #657796;
}

.register-body-row__name {
  max-width: 320px;
  font-size: 16px;
  font-weight: 600;
  color: $black-dark;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin register-tag-theme($color) {
  background-color: rgba($color, 0.14);
  color: $color;

  &:hover {
    background-color: rgba($color, 0.8);
    color: $white;
  }
}

.register-body-row__tag {
  min-width: 78px;
  justify-content: center;
  border: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    cursor: pointer;
  }

  &.is-linking {
    @include register-tag-theme($mainPrimary);
  }
  &.is-template {
    @include register-tag-theme($mainPrimary);
  }
  &.is-importing {
    @include register-tag-theme($mainPrimary);
  }
  &.is-export {
    @include register-tag-theme($mainInfo);
  }
  &.is-new-data {
    @include register-tag-theme($green-dark);
  }
  &.is-assignment {
    @include register-tag-theme($cyan-light);
  }
  &.is-dispatch {
    @include register-tag-theme($cyan-dark);
  }
  &.is-marking {
    @include register-tag-theme($green-dark);
  }
  &.is-unusual {
    @include register-tag-theme($mainWarning);
  }
  &.is-delete {
    @include register-tag-theme($mainDanger);
  }
}

.register-body-row__labels {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 0 10px;
  min-height: 18px;
}

.register-body-row__labels :deep(.el-link) {
  font-size: 12px;
  font-weight: 600;
}

.register-body-row__info {
  flex: 1;
}

.register-body-row__score {
  width: 200px;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  padding-top: 36px;
  flex-shrink: 0;
}

.register-body-row__score-item {
  min-width: 70px;
  text-align: center;
}

.register-body-row__score-item strong {
  display: block;
  font-size: 38px;
  line-height: 1;
  font-weight: 700;
  color: #1f2530;
}

.register-body-row__score-item span {
  display: block;
  margin-top: 14px;
  font-size: 13px;
  color: #515a6e;
}
</style>
