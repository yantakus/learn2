import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.uid()
    t.model.posts({ pagination: false })
  },
})
