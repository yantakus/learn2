import { server, schema, use } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import permissions from './permissions'

server.express.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)

schema.addToContext((req) => ({
  req,
}))

server.express.use(cookieParser())

use(prisma())

use(permissions)
