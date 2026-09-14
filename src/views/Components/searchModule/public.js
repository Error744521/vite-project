import { useMultipleStore } from '@/store/selectionMultiple.js'

const list = useMultipleStore()

const ObjectArray = {
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
  org_id: {
    component: 'selectEl',
    type: 'String',
    label: '管辖机构',
    key: 'org_id',
    options: [],
    request: { url: '/v1/orgs/user', method: 'post', param: {}, label: 'org_name', value: 'id' }
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
}

const searchFormFn = async (key) => {
  if (!isNaN(key) || key === 'PublicClass') {
    return ObjectArray
  }
  const importFile = await import(`../../ComponentsPages/${key}.js`)
  return importFile.default || importFile
}

export default searchFormFn
