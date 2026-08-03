import { useMultipleStore } from '@/store/selectionMultiple.js'

const list = useMultipleStore()

const ObjectArray = {
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
  company_name: {
    component: 'inputEl',
    type: 'text',
    label: '主体名称',
    key: 'company_name',
    maxlength: 100
  },
  credit_code: {
    component: 'inputEl',
    type: 'text',
    label: '社会统一信用代码',
    key: 'credit_code',
    maxlength: 18
  },
  link_man: {
    component: 'inputEl',
    type: 'text',
    label: '联系人',
    key: 'link_man',
    maxlength: 50
  },
  link_phone: {
    component: 'inputEl',
    type: 'text',
    label: '联系电话',
    key: 'link_phone',
    maxlength: 20
  },
  industry_id: {
    component: 'autocompleteEl',
    type: 'text',
    label: '所属行业',
    key: 'industry_id',
    options: [],
    request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
  },
  org_id: {
    component: 'selectEl',
    type: 'String',
    label: '管辖机构',
    key: 'org_id',
    options: [],
    request: { url: '/v1/orgs/user', method: 'post', param: {}, label: 'org_name', value: 'id' }
  },
  target_type: {
    component: 'selectEl',
    type: 'Array',
    label: '数据类型',
    key: 'target_type',
    options: list.getTargetType
  },
  area_ids: {
    component: 'cascaderLazy',
    type: 'Array',
    label: '所属区域',
    key: 'area_ids',
    options: [],
    request: { url: '/v1/orgs/orgdeptlist', method: 'post', param: {}, key: 'org_id', label: 'name', value: 'id' }
  },
  company_status: {
    component: 'cascaderEl',
    type: 'String',
    label: '企业状态',
    key: 'company_status',
    options: list.getCompanyStatus
  },
  company_type_ids: {
    component: 'cascaderEl',
    type: 'Array',
    label: '主体性质',
    key: 'company_type_ids',
    options: [],
    request: { url: '/v1/company/typetree', method: 'get', param: {}, label: 'company_type_name', value: 'id' }
  },
  create_at: {
    component: 'datepickerEl',
    type: 'date',
    label: '创建时间',
    key: 'create_at'
  },
  time_period: {
    component: 'datepickerEl',
    type: 'daterange',
    label: '起止日期',
    key: 'time_period',
    modelKeys: ['start_time', 'end_time']
  },
  updateDate: {
    component: 'datepickergroupEl',
    type: 'date',
    label: '日期类型',
    key: 'time_type',
    options: [{ label: '成立日期', value: 'establishmentDate' }]
  },
  time_type: {
    component: 'datepickergroupEl',
    type: 'daterange',
    label: '日期类型',
    key: 'time_type',
    options: [{ label: '成立日期', value: 'establishmentDate' }]
  },
  rang_flag: {
    component: 'radioGroup',
    type: 'radio',
    label: '辖区内外',
    key: 'rang_flag',
    options: [
      { label: '全部', value: '' },
      { label: '辖区内', value: 1 },
      { label: '辖区外', value: 2 }
    ]
  },
  send_flag: {
    component: 'radioGroup',
    type: 'button',
    label: '发送方式',
    key: 'send_flag',
    options: [
      { label: '全部', value: '' },
      { label: '数据接收', value: 1 },
      { label: '数据发送', value: 2 }
    ]
  },
  supervision: {
    component: 'radioGroup',
    type: 'radio',
    label: '监管状态',
    key: 'supervision',
    options: [
      { label: '全部', value: '' },
      { label: '已监管', value: 1 },
      { label: '未监管', value: 2 }
    ]
  },
  live_auth_type: {
    component: 'checkboxGroup',
    type: 'checkbox',
    label: '认证方式',
    key: 'live_auth_type',
    options: [],
    request: {
      url: '/v1/liveuserextend/live_user_filter_can',
      method: 'get',
      param: { type: 1 },
      label: 'value',
      value: 'id'
    }
  },
  live_delivery_method: {
    component: 'checkboxGroup',
    type: 'button',
    label: '带货方式',
    key: 'live_delivery_method',
    options: [],
    request: {
      url: '/v1/liveuserextend/live_user_filter_can',
      method: 'get',
      param: { type: 4 },
      label: 'value',
      value: 'id'
    }
  },
  live_user_cate: {
    component: 'classificationGroup',
    type: 'Array',
    label: '主播类型',
    key: 'live_user_cate',
    options: [],
    storeKey: 'getLiveUserCate',
    request: { url: '/v1/liveuserextend/live_user_cate_can', method: 'get', param: {}, label: 'value', value: 'id' }
  },
  live_goods_cate: {
    component: 'classificationGroup',
    type: 'String',
    label: '带货品类',
    key: 'live_goods_cate',
    options: [],
    request: { url: '/v1/liveuserextend/live_goods_cate_can', method: 'get', param: {}, label: 'value', value: 'id' }
  },
  area_id: {
    component: 'autocompleteEl',
    type: 'text',
    label: '所属行业',
    key: 'area_id',
    options: [],
    request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
  }
}

const searchFormFn = async (key) => {
  if (!isNaN(key) || key === 'Basics') {
    return ObjectArray
  }
  const importFile = await import(`../../ComponentsPages/${key}/public.js`)
  return importFile.default || importFile
}

export default searchFormFn
