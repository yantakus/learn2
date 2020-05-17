import { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import firebase from 'firebase/app'
import 'firebase/auth'
import gql from 'graphql-tag'

import { setSession, initFirebaseApp } from 'utils'

initFirebaseApp()

const CURRENT_USER_QUERY = gql`
  {
    me {
      uid
    }
  }
`

const useAuth = (force = false) => {
  const { data, refetch, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: force ? 'cache-and-network' : 'cache-first',
  })

  useEffect(() => {
    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe()
  }, [])

  function onChange(user) {
    if (user) setSession(user).then(() => refetch?.())
  }

  return { user: data?.me, refetch, loading }
}

export default useAuth
