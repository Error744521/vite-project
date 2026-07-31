const baseUrl = () => {
  if (import.meta.env.NODE_ENV === 'production') {
    return import.meta.env.NODE_ENV
  } else {
    return 'http://hyjgapi.scwljg.com/api'
  }
}

module.exports = baseUrl()
