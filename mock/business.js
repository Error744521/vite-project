import { paginate, success } from './_utils.js'

const websites = Array.from({ length: 36 }).map((_, index) => {
  const id = index + 1
  return {
    id,
    website_name: `示例网站 ${id}`,
    website_url: `https://example${id}.com`,
    flag: id % 3 === 0 ? '1' : '2',
    label_names: id % 2 === 0 ? '重点关注、食品经营' : '普通主体',
    website_licence: `京ICP备2026${String(id).padStart(4, '0')}号`,
    company_name: `北京示例科技有限公司 ${id}`,
    org_name: id % 2 === 0 ? '东城分局' : '市局',
    company_address: `北京市示例路 ${id} 号`,
    certificate_show_type: id % 2 === 0 ? '已亮证' : '未亮证',
    light_flag: id % 2 === 0 ? '是' : '否',
    updated_at: `2026-08-${String((id % 28) + 1).padStart(2, '0')} 10:00:00`
  }
})

const industryTree = [
  {
    id: 1,
    industry: '食品销售',
    children: [
      { id: 11, industry: '预包装食品' },
      { id: 12, industry: '生鲜蔬果' }
    ]
  },
  {
    id: 2,
    industry: '网络服务',
    children: [
      { id: 21, industry: '平台经营' },
      { id: 22, industry: '直播电商' }
    ]
  }
]

const companyTypeTree = [
  {
    id: 1,
    company_type_name: '企业',
    children: [
      { id: 11, company_type_name: '有限责任公司' },
      { id: 12, company_type_name: '股份有限公司' }
    ]
  },
  {
    id: 2,
    company_type_name: '个体工商户'
  }
]

const liveFilter = [
  { id: 1, value: '实名认证' },
  { id: 2, value: '企业认证' },
  { id: 3, value: '平台认证' }
]

export default [
  {
    url: '/v1/websites',
    method: 'get',
    response: ({ query }) => {
      const keyword = String(query.company_name || query.website_name || '').trim()
      const list = keyword
        ? websites.filter((item) => item.company_name.includes(keyword) || item.website_name.includes(keyword))
        : websites
      const result = paginate(list, {
        page: query.page || 1,
        pagesize: query.pagesize || query.pageSize || 15
      })
      return {
        ...result,
        meta: {
          current_page: result.meta.page,
          per_page: result.meta.pagesize,
          total: result.meta.total
        }
      }
    }
  },
  {
    url: '/v1/company/industrytree',
    method: 'get',
    response: () => success(industryTree)
  },
  {
    url: '/v1/company/typetree',
    method: 'get',
    response: () => success(companyTypeTree)
  },
  {
    url: '/v1/labels/list',
    method: 'get',
    response: () =>
      success([
        { id: 1, label_name: '重点关注' },
        { id: 2, label_name: '食品经营' },
        { id: 3, label_name: '直播带货' }
      ])
  },
  {
    url: '/v1/platforms/list',
    method: 'post',
    response: () =>
      success([
        { id: 1, platform_name: '淘宝' },
        { id: 2, platform_name: '京东' },
        { id: 3, platform_name: '抖音电商' }
      ])
  },
  {
    url: '/v1/liveuserextend/live_user_filter_can',
    method: 'get',
    response: () => success(liveFilter)
  },
  {
    url: '/v1/liveuserextend/live_user_cate_can',
    method: 'get',
    response: () =>
      success([
        { id: 1, value: '品牌自播' },
        { id: 2, value: '达人带货' },
        { id: 3, value: '店铺直播' }
      ])
  },
  {
    url: '/v1/liveuserextend/live_goods_cate_can',
    method: 'get',
    response: () =>
      success([
        { id: 1, value: '食品' },
        { id: 2, value: '服饰' },
        { id: 3, value: '数码' }
      ])
  },
  {
    url: '/v1/companies/company_import',
    method: 'post',
    response: () => success(null, '导入成功')
  }
]
