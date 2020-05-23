import * as admin from 'firebase-admin'

import '../../env'

const { GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_DATABASE_URL } = process.env

if (!(GOOGLE_APPLICATION_CREDENTIALS && FIREBASE_DATABASE_URL)) {
  throw new Error('Missing required env variables.')
}

const config = {
  credential: admin.credential.applicationDefault(),
  databaseURL: FIREBASE_DATABASE_URL,
}

export default () => {
  if (!admin.apps.length) {
    admin.initializeApp(config)
  }
}
