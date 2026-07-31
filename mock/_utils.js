export const success = (data = {}, msg = '请求成功') => ({
  code: 200,
  data,
  msg
})

export const fail = (msg = '请求失败', code = 500, data = null) => ({
  code,
  data,
  msg
})

export const hasPagination = (query = {}) => Object.prototype.hasOwnProperty.call(query, 'page')

export const pageResult = ({ data = [], total = data.length, page = 1, pagesize = 15, msg = '请求成功' } = {}) => ({
  code: 200,
  data,
  msg,
  meta: {
    page: Number(page),
    pagesize: Number(pagesize),
    total: Number(total)
  }
})

export const getPageParams = (query = {}) => {
  const page = Number(query.page || query.currentPage || 1)
  const pagesize = Number(query.pagesize || query.pageSize || query.limit || 15)

  return {
    page,
    pagesize
  }
}

export const paginate = (list = [], query = {}) => {
  if (!hasPagination(query)) {
    return success(list)
  }

  const { page, pagesize } = getPageParams(query)
  const start = (page - 1) * pagesize
  const end = start + pagesize

  return pageResult({
    data: list.slice(start, end),
    total: list.length,
    page,
    pagesize
  })
}
