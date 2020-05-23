import * as admin from 'firebase-admin'

import { cookies } from 'utils'
import initFirebaseAdmin from 'utils/server/initFirebaseAdmin'

const handler = (req, res) => {
  if (!req.body) {
    return res.status(400)
  }

  const { idToken, csrfToken } = req.body

  // Guard against CSRF attacks.
  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!')
    return
  }

  // See: https://firebase.google.com/docs/auth/admin/manage-cookies
  // Firebase docs:
  //   "This is a low overhead operation. The public certificates are initially
  //    queried and cached until they expire. Session cookie verification can be
  //    done with the cached public certificates without any additional network
  //    requests."
  // However, in a serverless environment, we shouldn't rely on caching, so
  // it's possible Firebase's `verifySessionCookie` will make frequent network
  // requests in a serverless context.

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000

  initFirebaseAdmin()

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  return admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        res.cookie('session', sessionCookie, { expiresIn })
        return res.end(JSON.stringify({ status: 'success' }))
      },
      (error) => {
        console.error(error)
        return res.status(401).send('UNAUTHORIZED REQUEST.')
      },
    )
}

export default cookies(handler)
