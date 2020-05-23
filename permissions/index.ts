import { rule, shield } from 'nexus-plugin-shield'
import getUserId from '../utils/server/getUserId'

const rules = {
  isAuthenticatedUser: rule()(async (_parent, _args, context) => {
    const userId = await getUserId(context)
    return Boolean(userId)
  }),
  isVideoOwner: rule()((_parent, { ytId }, context: NexusContext) => {
    const userIdPromise = getUserId(context)
    const authorPromise = context.db.video
      .findOne({
        where: {
          ytId,
        },
      })
      .uploader()
    return Promise.all([userIdPromise, authorPromise]).then(
      ([userId, author]) => userId === author?.uid,
    )
  }),
}

const permissions = shield({
  rules: {
    Query: {
      // me: rules.isAuthenticatedUser,
    },
    Mutation: {
      addVideo: rules.isAuthenticatedUser,
      editVideo: rules.isVideoOwner,
    },
  },
  options: {
    fallbackError: (thrownThing: any, parent, args, context, info) => {
      console.error(thrownThing)
      return thrownThing
    },
  },
})

export default permissions
