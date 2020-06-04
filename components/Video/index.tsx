import React from 'react'
import Link from 'next/link'
import { Box, Flex, Text, IconButton, Image, Divider } from '@chakra-ui/core'
import get from 'lodash/get'
import { useAuth } from 'hooks'
import { AiFillTags, AiFillFolder } from 'react-icons/ai'

const Video = ({ video }) => {
  const complexity = video.complexity.toLowerCase()
  const { user } = useAuth(true)
  const snippet = JSON.parse(video.snippet)
  return (
    <Flex
      overflow="hidden"
      borderWidth="4px"
      borderColor="gray.100"
      borderRadius="4px"
      borderStyle="solid"
      flexDir="column"
    >
      <Box position="relative">
        <Link href={`/video/${video.ytId}`}>
          <a>
            <Image
              width="100%"
              src={get(snippet, ['thumbnails', 'medium', 'url'])}
            />
          </a>
        </Link>
        {video?.uploader?.uid === user?.uid && (
          <Box position="absolute" bottom={1} right={1}>
            <Link href={`/video/${video.ytId}/edit`}>
              <a>
                <IconButton aria-label="Edit" size="xs" icon="edit" />
              </a>
            </Link>
          </Box>
        )}
      </Box>

      <Flex flexDirection="column" backgroundColor="white" flexGrow={1} p="1">
        <Flex mb={2} textTransform="capitalize">
          <Flex alignItems="center" flex="1">
            <Link href={`/complexity/${complexity}`}>
              <a className="m-0">{complexity}</a>
            </Link>
            <Divider
              orientation="vertical"
              mx="1"
              height="20px"
              borderColor="gray.500"
            />
            <Link href={`/language/${video.language.value}`}>
              <a>
                <Text fontSize="sm" fontStyle="italic">
                  {video.language.label}
                </Text>
              </a>
            </Link>
          </Flex>
          <Box flex="initial">{video.voteScore}</Box>
        </Flex>
        <Box mb="2">
          <Link href={`/video/${video.ytId}`}>
            <Text
              as="a"
              color="gray.900"
              fontWeight="700"
              display="block"
              lineHeight="1.2"
              cursor="pointer"
            >
              {snippet.title}
            </Text>
          </Link>
        </Box>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          fontSize="sm"
          mt="auto"
        >
          <Flex alignItems="center">
            <Box as={AiFillFolder} mr="1" size="18px" color="purple.500" />
            <Link href={`/topic/${video.topic.value}`}>
              <a>{video.topic.label}</a>
            </Link>
          </Flex>
          <Flex alignItems="center">
            <Box as={AiFillTags} mr="1" size="18px" color="pink.400" />
            {video.tags.map((item, i) => (
              <span key={item.value}>
                <Link href={`/tag/${item.value}`}>
                  <a>{item.label}</a>
                </Link>
                {i < video.tags.length - 1 && (
                  <Text as="span" pr="1">
                    ,
                  </Text>
                )}
              </span>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Video
