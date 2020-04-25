import { schema, use } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'

schema.addToContext((req) => ({
  req,
}))

use(prisma())
