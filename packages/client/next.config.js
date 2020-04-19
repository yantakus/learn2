const path = require('path')
const withTM = require('next-transpile-modules')(['@learn/common'])
require('@learn/common/env')

module.exports = withTM({
  webpack: (config) => {
    config.plugins = config.plugins || []

    config.resolve.modules = [path.resolve(__dirname, './src'), 'node_modules']

    return config
  },
  // Public, build-time env vars.
  // https://nextjs.org/docs#build-time-configuration
  env: {
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
  },
})
