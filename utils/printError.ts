import get from 'lodash/get'

const printError = (error) => {
  const message = get(error, 'message')
  return message ? message.replace('GraphQL error:', '').trim() : ''
}

export default printError
