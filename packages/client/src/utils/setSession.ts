// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/pages/index.js

import fetch from 'isomorphic-unfetch'
import Cookies from 'js-cookie'

const setSession = (user) => {
  // Log in.
  if (user) {
    const csrfToken = Cookies.get('csrfToken')
    return user.getIdToken().then((idToken) => {
      return fetch('/api/login', {
        method: 'POST',
        // eslint-disable-next-line no-undef
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ idToken, csrfToken }),
      })
    })
  }

  // // Log out.
  // return fetch('/api/logout', {
  //   method: 'POST',
  //   credentials: 'same-origin',
  // })
}

export default setSession
