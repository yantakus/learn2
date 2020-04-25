import { schema } from 'nexus'

schema.objectType({
  name: 'Video',
  definition(t) {
    t.model.ytId()
  },
})
