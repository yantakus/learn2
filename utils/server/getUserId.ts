import * as admin from 'firebase-admin'
import initFirebaseAdmin from './initFirebaseAdmin'

initFirebaseAdmin()

function getUserId(req) {
  const token = req.cookies?.session
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
