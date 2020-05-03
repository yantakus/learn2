import { useEffect, useState } from 'react'
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

const useAuth = () => {
  const { data, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'cache-and-network',
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    const user = data?.me
    setUser(user)
  }, [data])

  useEffect(() => {
    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe()
  }, [])

  function onChange(user) {
    setUser(user)

    // Call server to update session.
    setSession(user)
  }

  return { user, refetch }
}

export default useAuth
