import React from 'react'
import Link from 'next/link'

const Index: React.FC = () => {
  return (
    <div>
      <p>Hi there!</p>
      <div>
        <Link href={'/example'}>
          <a>Another example page</a>
        </Link>
      </div>
    </div>
  )
}

export default Index
