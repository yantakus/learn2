import { verifyIdToken } from '@learn/common/utils'

function getUserId(context) {
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    return verifyIdToken(token).then((decodedToken) => decodedToken?.uid)
  }
}

export default getUserId
