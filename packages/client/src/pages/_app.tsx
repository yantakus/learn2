import withApollo from 'next-with-apollo'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ThemeProvider, CSSReset, Box } from '@chakra-ui/core'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { getDataFromTree } from '@apollo/react-ssr'

import { Header } from 'components'
import theme from '../theme'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include', // Additional fetch() options
  fetch,
})

function App({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Header />
        <Box maxW="6xl" mx="auto" p="4">
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache().restore(initialState),
    })
  },
  { getDataFromTree },
)(App)
