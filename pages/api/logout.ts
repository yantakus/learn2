import { cookies } from 'utils'

const handler = (_req, res) => {
  res.clearCookie('session')
  return res.status(200).json({ status: true })
}

export default cookies(handler)
