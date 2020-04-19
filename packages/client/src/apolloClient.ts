import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { setContext } from 'apollo-link-context'
import firebase from 'firebase/app'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  credentials: 'same-origin', // Additional fetch() options
  fetch,
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = firebase.auth().currentUser?.getIdToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
  })
}
