import { rule, shield } from 'nexus-plugin-shield'

const rules = {
  isAuthenticatedUser: rule()(async (_parent, _args, context) => {
    return Boolean(context.userId)
  }),
  isVideoOwner: rule()(async (_parent, { ytId }, context) => {
    const author = await context.db.video
      .findOne({
        where: {
          ytId,
        },
      })
      .uploader()
    return context.userId === author?.uid
  }),
}

const permissions = shield({
  rules: {
    Mutation: {
      createOneVideo: rules.isAuthenticatedUser,
      updateOneVideo: rules.isVideoOwner,
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
