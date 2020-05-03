import firebase from 'firebase/app'
import 'firebase/auth'

// https://nextjs.org/docs/api-reference/next.config.js/environment-variables
// Trying to destructure process.env variables won't work due to the nature of webpack DefinePlugin.
const FIREBASE_PUBLIC_API_KEY = process.env.FIREBASE_PUBLIC_API_KEY
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN
const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID

if (
  !(
    FIREBASE_PUBLIC_API_KEY &&
    FIREBASE_AUTH_DOMAIN &&
    FIREBASE_DATABASE_URL &&
    FIREBASE_PROJECT_ID
  )
) {
  throw new Error('Missing required env variables.')
}

const config = {
  apiKey: FIREBASE_PUBLIC_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
}

export default () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}
