import gql from 'graphql-tag'

export const VIDEO_META_QUERY = gql`
  {
    topics {
      id
      value
      label
    }
    tags {
      id
      value
      label
    }
    languages {
      id
      value
      label
    }
  }
`

export const VIDEOS_QUERY = gql`
  {
    videos {
      ytId
      snippet
      voteScore
      tags {
        id
        value
        label
      }
      topic {
        id
        value
        label
      }
      language {
        id
        value
        label
      }
      complexity
    }
  }
`

export const UPDATE_VIDEO_MUTATION = gql`
  mutation(
    $ytId: String!
    $complexity: Complexity!
    $language: LanguageCreateOneWithoutParentInput!
    $topic: TopicCreateManyWithoutParentInput!
    $tags: TagCreateManyWithoutParentInput!
  ) {
    updateVideo(
      ytId: $ytId
      complexity: $complexity
      language: $language
      topic: $topic
      tags: $tags
    ) {
      ytId
    }
  }
`

export const CREATE_VIDEO_MUTATION = gql`
  mutation(
    $ytId: String!
    $complexity: Complexity!
    $language: LanguageWhereUniqueInput!
    $topic: TopicWhereUniqueInput
    $addedTopic: TopicCreateWithoutVideosInput
    $tags: [TagWhereUniqueInput!]
    $addedTags: [TagCreateWithoutVideosInput!]
  ) {
    createOneVideo(
      ytId: $ytId
      complexity: $complexity
      language: $language
      topic: $topic
      addedTopic: $addedTopic
      tags: $tags
      addedTags: $addedTags
    ) {
      ytId
    }
  }
`
