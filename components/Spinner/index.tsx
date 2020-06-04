import React from 'react'
import { Box, Spinner, SpinnerProps } from '@chakra-ui/core'

const CustomSpinner: React.FC<SpinnerProps> = ({ size = 'xl', ...rest }) => (
  <Box textAlign="center">
    <Spinner size={size} {...rest} />
  </Box>
)

export default CustomSpinner
