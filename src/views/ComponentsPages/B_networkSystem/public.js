import { useMultipleStore } from '@/store/selectionMultiple.js'

const list = useMultipleStore()

const ObjectArray = {
  company_name: {
    component: 'inputEl',
    type: 'text',
    label: '主体名称',
    key: 'company_name'
  },
  credit_code: {
    component: 'inputEl',
    type: 'text',
    label: '社会统一信用代码',
    key: 'credit_code'
  },
  scope_name: {
    component: 'inputEl',
    type: 'text',
    label: '经营范围',
    key: 'scope_name'
  },
  company_address: {
    component: 'inputEl',
    type: 'text',
    label: '注册地址',
    key: 'company_address'
  },
  label_name: {
    component: 'autocompleteEl',
    type: 'text',
    label: '数据标签',
    key: 'label_name',
    options: [],
    request: { url: '/v1/labels/list', method: 'get', param: { target_type: 3 }, label: 'label_name', value: 'id' }
  },
  updateDate: {
    component: 'datepickergroupEl',
    type: 'date',
    label: '日期类型',
    key: 'time_type',
    options: [{ label: '成立日期', value: 'establishmentDate' }]
  },
  inclusion_mode: {
    component: 'selectGroup',
    type: 'Array',
    label: '包含方式',
    key: 'inclusion_mode',
    modelKeys: ['inclusion_type', 'targe_ids'],
    Association: true,
    options: list.getSelectionData,
    childOptions: list.getTargetType,
    request: [
      { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' },
      { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
    ]
  },
  industry_id: {
    component: 'cascaderEl',
    type: 'Array',
    label: '行业类型',
    key: 'industry_id',
    options: [],
    request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
  },
  org_id: {
    component: 'cascaderLazy',
    type: 'String',
    label: '管辖机构',
    key: 'org_id',
    options: [],
    request: { url: '/v1/orgs/user', method: 'post', param: {}, key: 'org_id', label: 'org_name', value: 'id' }
  },
  company_status: {
    component: 'cascaderEl',
    type: 'String',
    label: '企业状态',
    key: 'company_status',
    options: list.getCompanyStatus
  },
  capital: {
    component: 'selectEl',
    type: 'String',
    label: '注册资本',
    key: 'capital',
    options: list.getCapitalData
  },
  company_type_ids: {
    component: 'cascaderEl',
    type: 'Array',
    label: '主体性质',
    key: 'company_type_ids',
    options: [],
    request: { url: '/v1/company/typetree', method: 'get', param: {}, label: 'company_type_name', value: 'id' }
  },
  platform_id: {
    component: 'selectEl',
    type: 'Array',
    label: '电商平台经营',
    key: 'platform_id',
    options: [],
    request: { url: '/v1/platforms/list', method: 'POST', param: { platform_type: 1 }, label: 'platform_name', value: 'id' }
  },
  punish_flag: {
    component: 'selectEl',
    type: 'String',
    label: '行政处罚',
    key: 'punish_flag',
    options: list.getlimitData
  },
  complaint_flag: {
    component: 'selectEl',
    type: 'String',
    label: '投诉举报',
    key: 'complaint_flag',
    options: list.getlimitData
  },
  abnormal_flag: {
    component: 'selectEl',
    type: 'String',
    label: '列严列异',
    key: 'abnormal_flag',
    options: list.getlimitData
  },
  credit_level: {
    component: 'selectEl',
    type: 'String',
    label: '信用分级',
    key: 'credit_level',
    options: list.getlimitLevel
  },
  risk_level: {
    component: 'selectEl',
    type: 'String',
    label: '风险分级',
    key: 'risk_level',
    options: list.getlimitLevel
  }
}

export default ObjectArray
