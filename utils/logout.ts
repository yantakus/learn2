/* globals window */
import firebase from 'firebase/app'
import 'firebase/auth'
import fetch from 'isomorphic-unfetch'

export default async () => {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'same-origin',
  })
    .then(() =>
      firebase
        .auth()
        .signOut()
        .then(() => true)
        .catch((e) => {
          console.error(e)
          return false
        }),
    )
    .catch((e) => {
      console.error(e)
      return false
    })
}
