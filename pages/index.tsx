import React from 'react'
import { SimpleGrid, Spinner, Box } from '@chakra-ui/core'
import { Video } from 'components'
import { map } from 'lodash'
import { useQuery } from '@apollo/react-hooks'
import { VIDEOS_QUERY } from 'models/video'

const HomePage = () => {
  const { data, loading } = useQuery(VIDEOS_QUERY)
  if (loading)
    return (
      <Box textAlign="center">
        <Spinner size="xl" />
      </Box>
    )
  return (
    <SimpleGrid columns={{ xs: 1, sm: 2, md: 3 }} spacing="6">
      {map(data?.videos, (video) => (
        <Video video={video} />
      ))}
    </SimpleGrid>
  )
}

export default HomePage
