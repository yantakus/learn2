import React from 'react'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/core'

import { printError } from 'utils'

type Props = {
  error: { message: string }
}
const Error: React.FC<Props> = ({ error }) => (
  <Alert status="error">
    <AlertIcon />
    <AlertDescription>{printError(error)}</AlertDescription>
  </Alert>
)

export default Error
