import * as admin from 'firebase-admin'
import { initFirebaseAdmin } from '@learn/common/utils'

initFirebaseAdmin()

function getUserId({ req }) {
  const cookieToken = req.cookies?.session
  const headerToken = req.get('Authorization')?.replace('Bearer ', '')
  const token = cookieToken || headerToken
  // Verify the session cookie. In this case an additional check is added to detect if the user's Firebase session was revoked, user deleted/disabled, etc.
  if (token) {
    return admin
      .auth()
      .verifySessionCookie(token, true /** checkRevoked */)
      .then((decodedClaims) => {
        return decodedClaims.user_id
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export default getUserId
