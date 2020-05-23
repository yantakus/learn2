import React from 'react'
import { Box, AspectRatioBoxProps, AspectRatioBox } from '@chakra-ui/core'

type Props = {
  ytId: string
}
const Player: React.FC<Props & AspectRatioBoxProps> = ({ ytId, ...rest }) => {
  if (!ytId) return null
  return (
    <AspectRatioBox ratio={16 / 9} {...rest}>
      <Box
        width="100%"
        as="iframe"
        // @ts-expect-error
        src={`https://www.youtube.com/embed/${ytId}`}
        allowFullScreen
      />
    </AspectRatioBox>
  )
}

export default Player
