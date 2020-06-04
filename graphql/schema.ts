import { schema, use, server, settings } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import { GraphQLJSONObject } from 'graphql-type-json'
import cookieParser from 'cookie-parser'
import { reduce } from 'lodash'

import permissions from '../permissions'
import getUserId from '../utils/server/getUserId'

settings.change({
  schema: {
    connections: {
      default: {
        includeNodesField: true,
      },
    },
  },
})

schema.addToContext(async (req) => {
  const userId = await getUserId(req)
  return {
    req,
    userId,
  }
})

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
    t.crud.createOneLanguage()

    t.field('createOneVideo', {
      type: 'Video',
      args: {
        ytId: schema.stringArg({ nullable: false }),
        complexity: schema.arg({ type: 'Complexity', nullable: false }),
        language: schema.arg({
          type: 'LanguageWhereUniqueInput',
          nullable: false,
        }),
        topic: schema.arg({
          type: 'TopicWhereUniqueInput',
        }),
        addedTopic: schema.arg({
          type: 'TopicCreateWithoutVideosInput',
        }),
        tags: schema.arg({
          type: 'TagWhereUniqueInput',
          list: true,
        }),
        addedTags: schema.arg({
          type: 'TagCreateWithoutVideosInput',
          list: true,
        }),
      },
      async resolve(
        _root,
        { ytId, language, complexity, tags, addedTags, topic, addedTopic },
        ctx,
      ) {
        let ytResponse
        try {
          ytResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${process.env.YOUTUBE_API_KEY}&id=${ytId}`,
          ).then((res) => res.json())
        } catch (e) {
          return e
        }

        const data = {
          ytId,
          snippet: JSON.stringify(ytResponse.items[0].snippet),
          etag: ytResponse.items[0].etag,
          complexity,
          language: { connect: language },
          tags: { connect: tags, create: addedTags },
          topic: { connect: topic, create: addedTopic },
          uploader: { connect: { uid: ctx.userId } },
        }

        if (ytResponse?.pageInfo?.totalResults < 1) {
          return new Error('Error while fetching snippet')
        }

        return ctx.db.video.create({
          data,
        })
      },
    })

    t.field('voteVideo', {
      type: 'Video',
      args: {
        ytId: schema.stringArg({ nullable: false }),
        type: schema.arg({ type: 'VoteType', nullable: false }),
      },
      async resolve(_root, { ytId, type }, { userId, db }) {
        const video = await db.video.findOne({
          where: { ytId },
          select: {
            votes: { where: { userId }, select: { type: true, id: true } },
          },
        })
        if (!video) {
          throw new Error('Video not found')
        }
        const existingVote = video.votes[0]
        const existingVoteHasTheSameType =
          existingVote && existingVote.type === type

        if (!existingVote) {
          return db.video.update({
            where: { ytId },
            data: {
              votes: {
                create: {
                  type,
                  user: { connect: { uid: userId } },
                },
              },
            },
          })
        } else if (existingVoteHasTheSameType) {
          return db.video.update({
            where: { ytId },
            data: {
              votes: { delete: { id: existingVote.id } },
            },
          })
        } else {
          return db.video.update({
            where: { ytId },
            data: {
              votes: {
                update: { where: { id: existingVote.id }, data: { type } },
              },
            },
          })
        }
      },
    })

    t.field('bookmarkVideo', {
      type: 'Video',
      args: {
        ytId: schema.stringArg({ nullable: false }),
      },
      async resolve(_root, { ytId }, { userId, db }) {
        const video = await db.video.findOne({
          where: { ytId },
          select: {
            bookmarkers: { where: { uid: userId }, select: { uid: true } },
          },
        })
        if (!video) {
          throw new Error('Video not found')
        }
        const alreadyBookmarked = video.bookmarkers[0]

        if (alreadyBookmarked) {
          return db.video.update({
            where: { ytId },
            data: {
              bookmarkers: {
                disconnect: {
                  uid: userId,
                },
              },
            },
          })
        } else {
          return db.video.update({
            where: { ytId },
            data: {
              bookmarkers: {
                connect: {
                  uid: userId,
                },
              },
            },
          })
        }
      },
    })
  },
})

schema.queryType({
  definition(t) {
    t.crud.user()
    t.crud.users()
    t.crud.video()
    t.crud.videos()
    t.crud.languages()
    t.crud.topics()
    t.crud.tags()

    t.field('me', {
      type: 'User',
      resolve: async (_parent, _args, ctx) => {
        if (ctx.userId) {
          return ctx.db.user.findOne({
            where: {
              uid: ctx.userId,
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
  name: 'Topic',
  definition(t) {
    t.model.id()
    t.model.label()
    t.model.value()
    t.model.videos()
  },
})

schema.objectType({
  name: 'Language',
  definition(t) {
    t.model.id()
    t.model.label()
    t.model.value()
    t.model.videos()
  },
})

schema.objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.label()
    t.model.value()
    t.model.videos()
  },
})

schema.objectType({
  name: 'Vote',
  definition(t) {
    t.model.id()
    t.model.type()
    t.model.user()
    t.model.video()
  },
})

schema.objectType({
  name: 'Video',
  definition(t) {
    t.model.ytId()
    t.model.uploader()
    t.model.bookmarkers()
    t.model.language()
    t.model.complexity()
    t.model.topic()
    t.model.snippet()
    t.model.tags()
    t.model.votes()
    t.field('voteScore', {
      type: 'Int',
      async resolve(root, _args, ctx) {
        const votes = await ctx.db.vote.findMany({
          where: { videoId: root.ytId },
          select: { type: true },
        })
        return reduce(
          votes,
          function (sum, vote) {
            if (vote.type === 'UP') {
              return sum + 1
            } else {
              return sum - 1
            }
          },
          0,
        )
      },
    })
  },
})
