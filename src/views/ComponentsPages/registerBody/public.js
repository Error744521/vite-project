import { useMultipleStore } from "@/store/selectionMultiple.js";
const list = useMultipleStore()

const ObjectArray = {
    company_name: {
      component: 'inputEl',
        attributes: {type: 'text', label: '主体名称', key: 'company_name'}
    },
    credit_code: {
      component: 'inputEl',
        attributes: {type: 'text', label: '社会统一信用代码', key: 'company_name'}
    },
    scope_name: {
      component: 'inputEl',
        attributes: {type: 'text', label: '经营范围', key: 'scope_name'}
    },
    company_address: {
      component: 'inputEl',
        attributes: {type: 'text', label: '注册地址', key: 'company_name'}
    },
    label_name: {
      component: 'autocompleteEl', attributes: {
        type: 'text', label: '数据标签', key: 'label_name', list: [],
          request: {url: '/v1/labels/list', method: 'get', param: { target_type: 3 }, label: 'label_name', value: 'id'}
      }
    },
    updateDate: {
      component: 'datepickergroupEl',
      attributes: { type: 'date', label: '日期类型', key: 'time_type', list: [{label: '成立日期', value: 'establishmentDate'}]}
    },
    inclusion_mode: {
      component: 'selectGroup', /* type: String/Array 单选多选   keys: ['inclusion_type', 'targe_ids'] Association： 是否有关联关系  */
      attributes: {
        type: 'Array',
        label: '包含方式',
        keys: ['inclusion_type', 'targe_ids'],
        Association: true,
        list: list.getSelectionData,
        childlist: list.getTargetType,
        request: [
          { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id'},
          { url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id'}]
      }
    },
    industry_id: {
      component: 'cascaderEl', attributes: {
        type: 'Array', label: '行业类型', key: 'industry_id', list: [],
        request: {url: '/v1/company/industrytree', method: 'get', param: {}, label: 'industry', value: 'id'}
      }
    },
    org_id: {
      component: 'cascaderLazy', attributes: {
        type: 'String', label: '管辖机构', key: 'org_id', list: [],
        request: {url: '/v1/orgs/user', method: 'post', param: {}, key: 'org_id', label: 'org_name', value: 'id'}
      }
    },
    company_status: {
      component: 'cascaderEl', attributes: {
        type: 'String', label: '企业状态', key: 'company_status', list: list.getCompanyStatus,
        request: null
      }
    },
    capital: {
      component: 'selectEl', attributes: {
        type: 'String', label: '注册资本', key: 'capital', list: list.getCapitalData,
        request: {}
      }
    },
    company_type_ids: {
      component: 'cascaderEl', attributes: {
        type: 'Array', label: '主体性质', key: 'company_type_ids', list: [],
        request: {url: '/v1/company/typetree', method: 'get', param: {}, label: 'company_type_name', value: 'id'}
      }
    },
    platform_id: {
      component: 'selectEl', attributes: {
        type: 'Array', label: '电商平台经营', key: 'platform_id', list: [],
        request: {url: '/v1/platforms/list', method: 'POST', param: { platform_type: 1 }, label: 'platform_name', value: 'id'}
      }
    },
    punish_flag: {
      component: 'selectEl', attributes: {
        type: 'String', label: '行政处罚', key: 'punish_flag', list: list.getlimitData,
        request: null
      }
    },
    complaint_flag: {
      component: 'selectEl', attributes: {
        type: 'String', label: '投诉举报', key: 'complaint_flag', list: list.getlimitData,
        request: null
      }
    },
    abnormal_flag: {
      component: 'selectEl', attributes: {
        type: 'String', label: '列严列异', key: 'abnormal_flag', list: list.getlimitData,
        request: null
      }
    },
    credit_level: {
      component: 'selectEl', attributes: {
        type: 'String', label: '信用分级', key: 'credit_level', list: list.getlimitLevel,
        request: null
      }
    },
    risk_level: {
      component: 'selectEl', attributes: {
        type: 'String', label: '风险分级', key: 'risk_level', list: list.getlimitLevel,
        request: null
      }
    },
}

export default ObjectArray
