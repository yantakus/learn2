import { schema } from 'nexus'
import fetch from 'node-fetch'

import { getUserId } from '../utils'

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
