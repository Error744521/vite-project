const ObjectForm = {
  company_name: { component: 'inputForm', type: 'text', label: '主体名称', key: 'company_name',
    rules: [{ required: true, message: '请输入主体名称', trigger: 'blur' }, { min: 1, max: 100, message: '字符长度为1-100', trigger: 'blur' }]
  },
  credit_code: { component: 'inputForm', type: 'text', label: '社会统一信用代码', key: 'credit_code',
    rules: [{ required: true, message: '请输入信用代码', trigger: 'blur' }, { min: 1, max: 18, message: '字符长度为1-18', trigger: 'blur' }]
  },
  link_address: { component: 'textareaForm', type: 'text', label: '联系地址', key: 'link_address' },
  platform_id: { component: 'selectForm', type: 'string', label: '平台名称', key: 'platform_id', options: [],
    request: { url: '/v1/platforms/list', method: 'post', param: { platform_type: 3 }, label: 'platform_name', value: 'id' }
  },
  takeout_category_id: { component: 'selectForm', type: 'Array', label: '平台名称', key: 'takeout_category_id', options: [],
    request: { url: '/v1/takeouts/catelist', method: 'post', param: { cate_id: 0 }, label: 'takeout_cate_name', value: 'id' }
  },
  flag: { component: 'selectForm', type: 'string', label: '店铺类型', key: 'flag',
    options: [{ label: '全部', value: '' }, { label: '交易网站', value: '3' }, { label: '非交易网站', value: '1' }]
  },
  category_id: { component: 'groupSelectForm', type: ['string', 'string'], label: '店铺分类', key: 'category_id', options: [],
    filterable: [false, false],
    request: [
      { url: '/v1/takeouts/catelist', method: 'post', param: { cate_id: 0 }, label: 'takeout_cate_name', value: 'id' },
      { url: '/v1/takeouts/catelist', method: 'post', param: {}, key: 'cate_id', label: 'takeout_cate_name', value: 'id' }
    ]
  },
  is_trade: { component: 'groupRadioForm', type: 'radio', label: '经营性质', key: 'is_trade', request: {},
    options: [{ label: '全部', value: '' }, { label: '非交易', value: '0' }, { label: '交易', value: '1' }]
  },
  monitor_frequency_flag: { component: 'groupRadioForm', type: 'button', label: '监测频率', key: 'monitor_frequency_flag', options: [],
    request: { url: '/v1/takeouts/catelist', method: 'post', param: { cate_id: 0 }, label: 'takeout_cate_name', value: 'id' }
  },
  start_time: { component: 'datepickerForm', type: 'date', label: '开办时间', key: 'start_time' },
  date_range: { component: 'datepickerForm', type: 'daterange', label: '更新日期', key: 'date_range' },
  behavior_id: { component: 'cascaderForm', type: 'string', label: '违法行为', key: 'behavior_id', options: [],
    showPrefix: false, multiple: true, checkStrictly: false, emitPath: true,
    request: { url: '/v1/behavior/summarylist', method: 'post', param: {}, label: 'name', value: 'id' }
  },
  label_id: { component: 'autocompleteForm', type: 'string', label: '数据标签', key: 'label_id', options: [],
    request: { url: '/v1/labels/list', method: 'post', param: { target_type: 3 }, label: 'label_name', value: 'id' }
  },
  file_path: { component: 'uploadFileForm', type: 'string', label: '文件上传', key: 'file_path', options: [],
    accept: '.xls,.xlsx', text: '文件上传', tip: true, limit: 1,
    request: { url: '/v1/companies/company_import', method: 'post', param: {} }
  },
  image_path: { component: 'uploadPictureForm', type: 'string', label: '图片上传', key: 'image_path', options: [],
    accept: '.jpeg,.png,.pdf,.jpg', text: '图片上传', tip: true, limit: 1,
    request: { url: '/v1/uploads/img', method: 'post', param: { target_type: 3 } }
  }
}

export default ObjectForm
