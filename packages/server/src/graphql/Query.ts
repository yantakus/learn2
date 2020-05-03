import { schema } from 'nexus'
import { getUserId } from '../utils'

schema.queryType({
  definition(t) {
    t.crud.users()

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
