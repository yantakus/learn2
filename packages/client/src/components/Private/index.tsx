import React from 'react'

import { Auth } from 'components'
import { useAuth } from 'hooks'

interface IProps {
  returnUser?: boolean // return function and pass user as parameter
  children: any
}

const Private = ({ returnUser, children }: IProps) => {
  const { user, loading } = useAuth()
  if (loading) return <p>Loading...</p>
  // console.log(user)
  if (!user) {
    return (
      <div>
        <h3 className="text-center mb-10">Please Sign In before Continuing</h3>
        <Auth />
      </div>
    )
  }
  if (returnUser) {
    return children(user, loading)
  } else {
    return children
  }
}

export default Private
