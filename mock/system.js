import { paginate, success } from './_utils.js'

const menuList = [
  {
    id: 1,
    menu_name: '基础示例',
    icon_name: 'icon-shouye',
    url: '/#',
    children: [
      { id: 11, menu_name: '页面样例', icon_name: 'icon-wenjian', url: '/index' },
      { id: 12, menu_name: '搜索表单', icon_name: 'icon-sousuo', url: '/serchFormDom' },
      { id: 13, menu_name: '登记表单', icon_name: 'icon-renzheng', url: '/registrationFormDom' },
      { id: 14, menu_name: '图标库', icon_name: 'icon-pingtai', url: '/iconfont' }
    ]
  },
  {
    id: 2,
    menu_name: '网监系统',
    icon_name: 'icon-shuju',
    url: '/#',
    children: [
      { id: 21, menu_name: '主体库', icon_name: 'icon-wenjian', url: '/registerBodyIndex' },
      { id: 22, menu_name: '网站管理', icon_name: 'icon-pingtai', url: '/websitemanagementIndex' }
    ]
  }
]

const systems = [
  {
    id: 1,
    name: '网监系统',
    url: '/index',
    img_url: '/favicon.ico',
    back_img: '',
    system_url: '/index'
  },
  {
    id: 10,
    name: '监测模型',
    url: '/caseBases',
    img_url: '/favicon.ico',
    back_img: '',
    system_url: '/caseBases'
  }
]

export default [
  {
    url: '/v1/sys',
    method: 'post',
    response: () => ({
      code: 200,
      msg: '请求成功',
      data: {
        sys_name: '网络交易智慧监管平台 Mock',
        foot: '市场监督管理局',
        license: 'ICP备案 Mock-000001',
        domain_name: 'localhost'
      },
      sys_name: '网络交易智慧监管平台 Mock',
      foot: '市场监督管理局',
      license: 'ICP备案 Mock-000001',
      domain_name: 'localhost'
    })
  },
  {
    url: '/v1/captcha/send',
    method: 'post',
    response: () => success(null, '验证码已发送')
  },
  {
    url: '/v1/auth/login',
    method: 'post',
    response: () =>
      success({
        id: 1,
        user_name: 'Mock 管理员',
        mobile: '13800138000',
        token: 'mock-token',
        org_name: '市场监督管理局',
        code: '110000',
        area_id: 110000,
        province: { id: 110000, name: '北京市' },
        city: { id: 110100, name: '北京市' },
        county: { id: 110101, name: '东城区' },
        avatar: '',
        slug_list_all: systems.map((item) => ({
          id: item.id,
          name: item.name,
          url: item.url
        }))
      })
  },
  {
    url: '/v1/auth/login_system',
    method: 'post',
    response: () => success({ token: 'mock-system-token' }, '系统切换成功')
  },
  {
    url: '/v1/users/menu',
    method: 'post',
    response: () => success([{ id: 1, menu_name: '根菜单', children: menuList }])
  },
  {
    url: '/v1/users/org_systems',
    method: 'post',
    response: () => success(systems)
  },
  {
    url: '/v1/users/resetpwd',
    method: 'post',
    response: () => success(null, '修改密码成功')
  },
  {
    url: '/v1/orgs/user',
    method: 'post',
    response: () =>
      success([
        { id: 1, org_name: '市局' },
        { id: 2, org_name: '东城分局' },
        { id: 3, org_name: '西城分局' }
      ])
  },
  {
    url: '/v1/orgs/orgdeptlist',
    method: 'post',
    response: () =>
      success([
        {
          id: 1,
          name: '市局',
          children: [
            { id: 11, name: '网监科' },
            { id: 12, name: '执法队' }
          ]
        }
      ])
  }
]
