import { rule, shield } from 'graphql-shield'
import { getUserId } from 'utils'

const rules = {
  isAuthenticatedUser: rule()(async (_parent, _args, context) => {
    const userId = await getUserId(context)
    return Boolean(userId)
  }),
  isPostOwner: rule()((_parent, { id }, context) => {
    const userIdPromise = getUserId(context)
    const authorPromise = context.prisma.post
      .findOne({
        where: {
          id: Number(id),
        },
      })
      .author()
    return Promise.all([userIdPromise, authorPromise]).then(
      ([userId, author]) => userId === author.id,
    )
  }),
}

export const permissions = shield({
  Query: {
    filterPosts: rules.isAuthenticatedUser,
    post: rules.isAuthenticatedUser,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    publish: rules.isPostOwner,
  },
})
