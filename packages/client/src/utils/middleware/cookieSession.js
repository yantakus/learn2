import cookieSession from 'cookie-session'
import '@learn/common/env' // load environment variables

const { SESSION_SECRET_CURRENT, SESSION_SECRET_PREVIOUS } = process.env

export const addSession = (req, res) => {
  if (!(SESSION_SECRET_CURRENT && SESSION_SECRET_PREVIOUS)) {
    throw new Error('Missing required env variables.')
  }

  // An array is useful for rotating secrets without invalidating old sessions.
  // The first will be used to sign cookies, and the rest to validate them.
  // https://github.com/expressjs/cookie-session#keys
  const sessionSecrets = [SESSION_SECRET_CURRENT, SESSION_SECRET_PREVIOUS]

  // Example:
  // https://github.com/billymoon/micro-cookie-session
  const includeSession = cookieSession({
    keys: sessionSecrets,
    // TODO: set other options, such as "secure", "sameSite", etc.
    // https://github.com/expressjs/cookie-session#cookie-options
    maxAge: 604800000, // week
    httpOnly: true,
    overwrite: true,
  })
  includeSession(req, res, () => {})
}

export default (handler) => (req, res) => {
  try {
    addSession(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Could not get user session.' })
  }
  return handler(req, res)
}
