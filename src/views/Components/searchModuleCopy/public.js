import { useMultipleStore } from '@/store/selectionMultiple.js'
const list = useMultipleStore()

const ObjectArray = {
  inclusion_mode: {
    component:
      'selectGroup' /* type: String/Array 单选多选   keys: ['inclusion_type', 'targe_ids'] Association： 是否有关联关系  */,
    attributes: {
      type: 'Array',
      label: '包含方式',
      keys: ['inclusion_type', 'targe_ids'],
      Association: true,
      list: list.getSelectionData,
      childlist: list.getTargetType,
      request: [
        { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' },
        { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
      ]
    }
  },
  company_name: {
    component: 'inputEl',
    attributes: { type: 'text', label: '主体名称', key: 'company_name', maxlength: 100 }
  },
  industry_id: {
    component: 'autocompleteEl',
    attributes: {
      type: 'text',
      label: '所属行业',
      key: 'industry_id',
      list: [],
      request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
    }
  },
  org_id: {
    component: 'selectEl',
    attributes: {
      type: 'String',
      label: '管辖机构',
      key: 'org_id',
      list: [],
      request: { url: '/v1/orgs/user', method: 'post', param: {}, label: 'org_name', value: 'id' }
    }
  },
  target_type: {
    component: 'selectEl',
    attributes: {
      type: 'Array',
      label: '数据类型',
      key: 'target_type',
      list: [],
      request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
    }
  },
  company_status: {
    component: 'cascaderEl',
    attributes: {
      type: 'String',
      label: '企业状态',
      key: 'company_status',
      list: list.getCompanyStatus,
      request: null
    }
  },
  company_type_ids: {
    component: 'cascaderEl',
    attributes: {
      type: 'Array',
      label: '主体性质',
      key: 'company_type_ids',
      list: [],
      request: { url: '/v1/company/typetree', method: 'get', param: {}, label: 'company_type_name', value: 'id' }
    }
  },
  create_at: { component: 'datepickerEl', attributes: { type: 'date', label: '创建时间', key: 'create_at' } },
  time_period: {
    component: 'datepickerEl',
    attributes: { type: 'daterange', label: '起止日期', key: 'time_period', keys: ['start_time', 'end_time'] }
  },
  updateDate: {
    component: 'datepickergroupEl',
    attributes: {
      type: 'date',
      label: '日期类型',
      key: 'time_type',
      list: [{ label: '成立日期', value: 'establishmentDate' }]
    }
  },
  time_type: {
    component: 'datepickergroupEl',
    attributes: {
      type: 'daterange',
      label: '日期类型',
      key: 'time_type',
      list: [{ label: '成立日期', value: 'establishmentDate' }]
    }
  },
  rang_flag: {
    component: 'radioGroup',
    attributes: {
      type: 'radio',
      label: '辖区内外',
      key: 'rang_flag',
      list: [
        { label: '全部', value: '' },
        { label: '辖区内', value: 1 },
        { label: '辖区外', value: 2 }
      ]
    }
  },
  send_flag: {
    component: 'radioGroup',
    attributes: {
      type: 'button',
      label: '发送方式',
      key: 'send_flag',
      list: [
        { label: '全部', value: '' },
        { label: '数据接收', value: 1 },
        { label: '数据发送', value: 2 }
      ]
    }
  },
  live_auth_type: {
    component: 'checkboxGroup',
    attributes: {
      type: 'checkbox',
      label: '认证方式',
      key: 'live_auth_type',
      list: [],
      request: {
        url: '/v1/liveuserextend/live_user_filter_can',
        method: 'get',
        param: { type: 1 },
        label: 'value',
        value: 'id'
      }
    }
  },
  live_delivery_method: {
    component: 'checkboxGroup',
    attributes: {
      type: 'button',
      label: '带货方式',
      key: 'live_delivery_method',
      list: [],
      request: {
        url: '/v1/liveuserextend/live_user_filter_can',
        method: 'get',
        param: { type: 4 },
        label: 'value',
        value: 'id'
      }
    }
  },
  live_user_cate: {
    component: 'classificationGroup',
    attributes: {
      type: 'Array',
      label: '主播类型',
      key: 'live_user_cate',
      list: [],
      storeKey: 'getLiveUserCate',
      request: { url: '/v1/liveuserextend/live_user_cate_can', method: 'get', param: {}, label: 'value', value: 'id' }
    }
  },
  live_goods_cate: {
    component: 'classificationGroup',
    attributes: {
      type: 'String',
      label: '带货品类',
      key: 'live_goods_cate',
      list: [],
      request: { url: '/v1/liveuserextend/live_goods_cate_can', method: 'get', param: {}, label: 'value', value: 'id' }
    }
  },
  area_id: {
    component: 'autocompleteEl',
    attributes: {
      type: 'text',
      label: '所属行业',
      key: 'industry_id',
      list: [],
      request: { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id' }
    }
  }
}
const searchFormFn = async (key) => {
  if (!isNaN(key) || key === 'Basics') {
    return ObjectArray
  } else {
    const importFile = await import(`../../ComponentsPages/${key}/public.js`)
    return importFile.default || importFile
  }
}
export default searchFormFn
