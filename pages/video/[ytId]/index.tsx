import React from 'react'
import { getOperationName } from 'apollo-utilities'
import { Box, IconButton, Tooltip, Text, Flex, Heading } from '@chakra-ui/core'
import get from 'lodash/get'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { BsBookmarkPlus, BsBookmarkDash } from 'react-icons/bs'

import {
  VIDEO_QUERY,
  VOTE_VIDEO_MUTATION,
  BOOKMARK_VIDEO_MUTATION,
} from 'models/video'
import { Spinner, Player } from 'components'
import { useAuth } from 'hooks'

type Props = {
  addVideo: Function
  router: {
    query: {
      ytId: string
    }
  }
}

const VideoPage: React.FC<Props> = (props) => {
  const { user } = useAuth()
  const ytId = props.router?.query?.ytId
  const { data, loading: queryLoading } = useQuery(VIDEO_QUERY, {
    variables: { where: { ytId } },
    errorPolicy: 'all',
  })
  const [bookmark, { loading: bookmarkMutationLoading }] = useMutation(
    BOOKMARK_VIDEO_MUTATION,
    {
      refetchQueries: [getOperationName(VIDEO_QUERY)],
    },
  )
  const [vote, { loading: voteMutationLoading }] = useMutation<
    NexusGen['argTypes']['Mutation']['voteVideo']
  >(VOTE_VIDEO_MUTATION, {
    refetchQueries: [getOperationName(VIDEO_QUERY)],
  })
  if (queryLoading) {
    return <Spinner />
  }
  const {
    video: { uploader, bookmarkers, votes, voteScore },
  } = data
  const snippet = JSON.parse(data.video.snippet)
  const bookmarked = bookmarkers.some((item) => {
    return get(user, 'uid') === item.uid
  })
  const existingVote = find(votes, (item) => {
    return get(user, 'uid') === item.user.uid
  })
  const upVote = get(existingVote, 'type') === 'UP'
  const downVote = get(existingVote, 'type') === 'DOWN'
  const bookmarkLabel = bookmarked
    ? 'Remove from bookmarks'
    : 'Add to bookmarks'
  return (
    <>
      <Player mb="4" ytId={ytId} />
      <Flex pb="6" mb="6">
        <Flex flexDir="column">
          <IconButton
            size="xs"
            aria-label="Upvote"
            variantColor={upVote ? 'pink' : 'gray'}
            isDisabled={voteMutationLoading}
            onClick={() =>
              vote({
                variables: {
                  type: 'UP',
                  ytId,
                },
              })
            }
            icon="chevron-up"
          />
          <Box fontSize="2xl" textAlign="center">
            <strong>
              {voteMutationLoading ? (
                <Spinner size="xs" />
              ) : (
                <Text
                  color={
                    voteScore < 0
                      ? 'red.300'
                      : voteScore === 0
                      ? 'gray.500'
                      : 'green.300'
                  }
                  as="span"
                >
                  {voteScore}
                </Text>
              )}
            </strong>
          </Box>
          <IconButton
            size="xs"
            aria-label="Downvote"
            variantColor={downVote ? 'pink' : 'gray'}
            isDisabled={voteMutationLoading}
            onClick={() =>
              vote({
                variables: {
                  type: 'DOWN',
                  ytId,
                },
              })
            }
            icon="chevron-down"
          />
        </Flex>
        <Flex flexDir="column" flex={1} px="2">
          <Flex mx={-2}>
            <Heading as="h5" fontSize="lg" flex={1} px="2">
              Added by {uploader.uid}
            </Heading>
            {user && (
              <Box flex="initial" px="2">
                <Tooltip aria-label={bookmarkLabel} label={bookmarkLabel}>
                  <IconButton
                    aria-label={bookmarkLabel}
                    size="sm"
                    variantColor={bookmarked ? 'pink' : 'gray'}
                    icon={bookmarked ? BsBookmarkDash : BsBookmarkPlus}
                    onClick={() => {
                      const adding = !bookmarked
                      bookmark({
                        variables: {
                          ytId,
                          adding,
                        },
                        optimisticResponse: {
                          bookmarkVideo: {
                            bookmarkers: adding
                              ? [
                                  ...bookmarkers,
                                  {
                                    id: user.uid,
                                    __typename: 'User',
                                  },
                                ]
                              : filter(bookmarkers, (o) => o.id !== user.uid),
                            __typename: 'Video',
                          },
                          __typename: 'Mutation',
                        },
                        update: (
                          proxy,
                          {
                            data: {
                              bookmarkVideo: { bookmarkers },
                            },
                          },
                        ) => {
                          const data: any = proxy.readQuery({
                            query: VIDEO_QUERY,
                            variables: { ytId },
                          })
                          data.video = {
                            ...data.video,
                            bookmarkers,
                          }
                          proxy.writeQuery({ query: VIDEO_QUERY, data })
                        },
                      })
                    }}
                    isDisabled={bookmarkMutationLoading}
                  />
                </Tooltip>
              </Box>
            )}
          </Flex>
          <Heading as="h3" fontSize="xl" mt="auto">
            Details
          </Heading>
        </Flex>
      </Flex>
      <Text>{get(snippet, 'description')}</Text>
    </>
  )
}

export default VideoPage
