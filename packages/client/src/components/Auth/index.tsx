/* globals window */
import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/core'

import { initFirebaseApp } from 'utils'

const CREATE_USER_MUTATION = gql`
  mutation createOneUser($data: UserCreateInput!) {
    createOneUser(data: $data) {
      uid
    }
  }
`

// Init the Firebase app.
initFirebaseApp()

// As httpOnly cookies are to be used, do not persist any state client side.
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

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
  } as any
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
  const [createOneUser] = useMutation(CREATE_USER_MUTATION)
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
