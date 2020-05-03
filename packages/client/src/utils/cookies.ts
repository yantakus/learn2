import { serialize } from 'cookie'

// Taken from https://github.com/zeit/next.js/blob/master/examples/api-routes-middleware/utils/cookies.js
/**
 * This sets `cookie` on `res` object
 */
const cookie = (res, name, value, options) => {
  const defaultOptions = {
    httpOnly: true,
    path: '/',
    /* secure: true */
  }
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }
  function isNull(a) {
    return typeof a == 'object' && !a
  }
  const stringValue = isNull(value)
    ? value
    : typeof value === 'object'
    ? 'j:' + JSON.stringify(value)
    : String(value)

  if (mergedOptions?.maxAge) {
    mergedOptions.expires = new Date(Date.now() + mergedOptions.maxAge)
    mergedOptions.maxAge /= 1000
  }

  res.setHeader(
    'Set-Cookie',
    serialize(name, String(stringValue), mergedOptions),
  )
}

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const cookies = (handler) => (req, res) => {
  res.cookie = (name, value, options) => cookie(res, name, value, options)
  res.clearCookie = (name) => cookie(res, name, null, { expires: new Date(0) })

  return handler(req, res)
}

export default cookies
