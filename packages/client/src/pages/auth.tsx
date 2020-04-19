import React from 'react'

import { withApollo } from 'utils/apollo'
import FirebaseAuth from 'components/FirebaseAuth'

const Auth = () => {
  return (
    <div>
      <p>Sign in</p>
      <div>
        <FirebaseAuth />
      </div>
    </div>
  )
}

export default withApollo()(Auth)
