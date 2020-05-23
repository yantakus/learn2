import { schema, use, server } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import { GraphQLJSONObject } from 'graphql-type-json'
import cookieParser from 'cookie-parser'

import permissions from 'permissions'
import getUserId from 'utils/server/getUserId'

schema.addToContext((req) => ({
  req,
}))

server.express.use(cookieParser())

use(prisma())
use(permissions)

// Types

schema.scalarType({
  name: 'JSON',
  serialize: GraphQLJSONObject.serialize,
  parseValue: GraphQLJSONObject.parseValue,
  parseLiteral: GraphQLJSONObject.parseLiteral,
})

schema.mutationType({
  definition(t) {
    t.crud.createOneUser()
  },
})

schema.queryType({
  definition(t) {
    t.crud.users()

    t.field('snippet', {
      type: 'JSON',
      args: {
        ytId: schema.stringArg(),
      },
      async resolve(root, { ytId }, ctx) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${process.env.YOUTUBE_API_KEY}&id=${ytId}`,
        ).then((res) => res.json())
        return response
      },
    })

    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (_parent, _args, ctx) => {
        const userId = await getUserId(ctx)
        if (userId) {
          return ctx.db.user.findOne({
            where: {
              uid: userId,
            },
          })
        }
        return null
      },
    })

    t.list.field('searchVideos', {
      type: 'Video',
      args: {
        searchString: schema.stringArg({ nullable: true }),
      },
      resolve: (_parent, { searchString }, ctx) => {
        return ctx.db.video.findMany({
          where: {
            snippet: {
              contains: searchString,
            },
          },
        })
      },
    })
  },
})

schema.objectType({
  name: 'User',
  definition(t) {
    t.model.uid()
  },
})

schema.objectType({
  name: 'Video',
  definition(t) {
    t.model.ytId()
  },
})
