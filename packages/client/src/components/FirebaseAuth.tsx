/* globals window */
import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import {
  NexusGenFieldTypes,
  NexusGenArgTypes,
} from '@learn/server/src/generated/nexus'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/core'

import initFirebase from 'utils/auth/initFirebase'

const CREATE_USER_MUTATION = gql`
  mutation createOneUser($data: UserCreateInput!) {
    createOneUser(data: $data) {
      uid
    }
  }
`

// Init the Firebase app.
initFirebase()

function createFirebaseAuthConfig(createOneUser, router, setAuthError) {
  return {
    signInFlow: 'popup',
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
    ],
    credentialHelper: 'none',
    callbacks: {
      signInSuccess: function (user) {
        const { metadata } = user
        const isNewUser = metadata.creationTime === metadata.lastSignInTime
        if (isNewUser) {
          createOneUser({ variables: { data: { uid: user.uid } } })
            .then(() => {
              router.push('/')
            })
            .catch((error) => {
              console.error(error)
              setAuthError(error.message)
            })
        } else {
          router.push('/')
        }
      },
    },
  }
}

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false)
  const [authError, setAuthError] = useState('')
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true)
    }
  }, [])
  const [createOneUser] = useMutation<
    { createOneUser: NexusGenFieldTypes['Mutation']['createOneUser'] },
    { variables: NexusGenArgTypes['Mutation']['createOneUser'] }
  >(CREATE_USER_MUTATION)
  return (
    <div>
      {renderAuth ? (
        <StyledFirebaseAuth
          uiConfig={createFirebaseAuthConfig(
            createOneUser,
            router,
            setAuthError,
          )}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
      {authError ? (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

export default FirebaseAuth
