import React from 'react'
import { Box, Heading, Flex, Text, Button } from '@chakra-ui/core'

const MenuItem = ({ children }) => (
  <Text mr="6" display="block">
    {children}
  </Text>
)

const Header = (props) => {
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
            Learn
          </Heading>
        </Flex>

        <Flex>
          <MenuItem>About</MenuItem>
          <MenuItem>Help</MenuItem>
        </Flex>

        <Button ml="auto" bg="transparent" border="1px">
          Create account
        </Button>
      </Flex>
    </Box>
  )
}

export default Header
