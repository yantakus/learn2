import { ThemeProvider, CSSReset, Box } from '@chakra-ui/core'

import { Header } from 'components'
import { withApollo } from 'utils'
import theme from '../theme'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Header />
      <Box maxW="6xl" mx="auto" p="4">
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  )
}

export default withApollo(App)
