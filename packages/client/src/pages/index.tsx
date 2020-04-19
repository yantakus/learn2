import React from 'react'
import { get } from 'lodash/object'
import Link from 'next/link'
import Router from 'next/router'

import withAuthUser from '../utils/pageWrappers/withAuthUser'
import withAuthUserInfo from '../utils/pageWrappers/withAuthUserInfo'
import logout from '../utils/auth/logout'

type Props = {
  AuthUserInfo: {
    AuthUser: {
      id: string
      email: string
      emailVerified: boolean
    }
    token?: string
  }
  data: {
    user: {
      id: string
    }
  }
}
const Index: React.FC<Props> = (props) => {
  const { AuthUserInfo } = props
  const AuthUser = get(AuthUserInfo, 'AuthUser', null)
  return (
    <div>
      <p>Hi there!</p>
      {!AuthUser ? (
        <p>
          You are not signed in.{' '}
          <Link href={'/auth'}>
            <a>Sign in</a>
          </Link>
        </p>
      ) : (
        <div>
          <p>You're signed in. Email: {AuthUser.email}</p>
          <p
            style={{
              display: 'inlinelock',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={async () => {
              try {
                await logout()
                Router.push('/auth')
              } catch (e) {
                console.error(e)
              }
            }}
          >
            Log out
          </p>
        </div>
      )}
      <div>
        <Link href={'/example'}>
          <a>Another example page</a>
        </Link>
      </div>
    </div>
  )
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(Index))
