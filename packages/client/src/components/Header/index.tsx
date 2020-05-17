import React from 'react'
import { Box, Heading, Flex, Text, Button } from '@chakra-ui/core'
import Link from 'next/link'

import { logout } from 'utils'
import { useAuth } from 'hooks'

const MenuItem = ({ children }) => (
  <Text mr="6" display="block">
    {children}
  </Text>
)

const Header = (props) => {
  const { user, refetch } = useAuth(true)
  return (
    <Box bg="teal.500">
      <Flex
        as="nav"
        align="center"
        wrap="wrap"
        p="4"
        maxW="6xl"
        mx="auto"
        color="white"
        {...props}
      >
        <Flex align="center" mr="20">
          <Heading as="h1" size="lg" letterSpacing="-.1rem">
            <Link href="/">Learn</Link>
          </Heading>
        </Flex>

        <Flex>
          <MenuItem>
            <Link href="/add">Add video</Link>
          </MenuItem>
          <MenuItem>About</MenuItem>
        </Flex>

        <Box ml="auto">
          {user && (
            <Box display="inline" mr="4">
              You're signed in. Uid: {user.uid}
            </Box>
          )}
          {!user ? (
            <Link href="/auth">
              <a>
                <Button ml="auto" bg="transparent" border="1px">
                  Sign in
                </Button>
              </a>
            </Link>
          ) : (
            <Button
              ml="auto"
              bg="transparent"
              border="1px"
              onClick={async () => {
                try {
                  await logout()
                  refetch()
                } catch (e) {
                  console.error(e)
                }
              }}
            >
              Sign out
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default Header
