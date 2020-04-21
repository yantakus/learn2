import React from 'react'

import { withApollo } from 'utils/apollo'
import { Auth } from 'components'

const AuthPage = () => {
  return (
    <div>
      <p>Sign in</p>
      <div>
        <Auth />
      </div>
    </div>
  )
}

export default withApollo()(AuthPage)
