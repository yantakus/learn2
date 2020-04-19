import { verifyIdToken } from '@learn/common/utils'
import { Context } from './context'

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    return verifyIdToken(token).then((decodedToken) => decodedToken?.uid)
  }
}
