import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Input, Box, FormLabel, Button, Flex } from '@chakra-ui/core'
import qs from 'qs'
import { Formik } from 'formik'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import { NexusGenFieldTypes } from 'typegen-nexus'
import { find, map, filter } from 'lodash'

import {
  VIDEO_META_QUERY,
  UPDATE_VIDEO_MUTATION,
  CREATE_VIDEO_MUTATION,
} from 'models/video'
import { Player, Error } from 'components'

export const complexities = [
  { value: 'ELEMENTARY', label: 'Elementary' },
  { value: 'BASIC', label: 'Basic' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
]

type Option = {
  id?: number
  value: string
  label: string
  __isNew__?: boolean
}
type Props = {
  ytId?: string
  currentData?: NexusGenFieldTypes['Video']
}
const VideoForm: React.FC<Props> = (props) => {
  const { currentData } = props
  const updateMode = Boolean(props.currentData)

  const [ytId, setYtId] = useState(props.ytId)

  const [createVideo, { loading, error }] = useMutation<{
    variables: NexusGen['argTypes']['Mutation']['createOneVideo']
  }>(CREATE_VIDEO_MUTATION)

  const { data } = useQuery(VIDEO_META_QUERY)

  return (
    <Formik
      initialValues={{
        ytInput: props.ytId,
        complexity: find(
          complexities,
          (complexity) => complexity.value === currentData?.complexity,
        ),
        topic: currentData?.topic,
        tags: currentData?.tags,
        language: currentData?.language,
      }}
      onSubmit={({
        topic,
        tags,
        complexity,
        language,
      }: {
        ytInput: string
        topic: Option
        tags: Option[]
        complexity: Option
        language: Option
      }) => {
        const topicId = topic.id
        const newTags = filter(tags, (tag) => tag.__isNew__)
        const existingTags = filter(tags, (tag) => tag.id)
        createVideo({
          variables: {
            ytId,
            complexity: complexity.value,
            language: { id: language.id },
            topic: topicId && {
              id: topicId,
            },
            addedTopic: topic.__isNew__ && {
              label: topic.label,
              value: topic.value.replace(/\W/g, '-'),
            },
            tags: map(existingTags, (tag: Option) => ({ id: tag.id })),
            addedTags: map(newTags, (tag) => ({
              value: tag.value,
              label: tag.label,
            })),
          },
        })
      }}
    >
      {(formik) => {
        function handleYtIdChange(e) {
          formik.handleChange(e)
          const value = e.target.value
          if (value.startsWith('http')) {
            const queryString = value.substring(value.indexOf('?') + 1)
            const ytId = qs.parse(queryString).v as string
            if (ytId.length === 11) {
              setYtId(ytId)
            }
          } else if (value.length === 11) {
            setYtId(value)
          }
        }

        function handleChange(value, actionMeta) {
          formik.setFieldValue(actionMeta.name, value)
        }

        return (
          <form onSubmit={formik.handleSubmit}>
            <Flex flexWrap="wrap" mx={-4}>
              <Box mb="4" width={1 / 2} px={4}>
                {updateMode ? null : (
                  <Box mb="4">
                    <FormLabel htmlFor="ytInput">
                      Enter youtube video url or id
                    </FormLabel>
                    <Input
                      id="ytInput"
                      name="ytInput"
                      onChange={handleYtIdChange}
                      value={formik.values.ytInput}
                    />
                  </Box>
                )}
                <Player ytId={ytId} />
              </Box>
              <Box width={1 / 2} px={4}>
                <Box mb="4">
                  <FormLabel>Language</FormLabel>
                  <Select
                    name="language"
                    options={data?.languages}
                    value={formik.values.language}
                    onChange={handleChange}
                    required
                  />
                </Box>

                <Box mb="4">
                  <FormLabel>Complexity</FormLabel>
                  <Select
                    name="complexity"
                    options={complexities}
                    value={formik.values.complexity}
                    onChange={handleChange}
                    required
                  />
                </Box>

                <Box mb="4">
                  <FormLabel>Topic</FormLabel>
                  <CreatableSelect
                    name="topic"
                    options={data?.topics}
                    value={formik.values.topic}
                    onChange={handleChange}
                    required
                  />
                </Box>

                <Box mb="4">
                  <FormLabel>Tags</FormLabel>
                  <CreatableSelect
                    name="tags"
                    options={data?.tags}
                    isMulti
                    value={formik.values.tags}
                    onChange={handleChange}
                    required
                  />
                </Box>
              </Box>
            </Flex>

            <Button type="submit" isLoading={loading} mb="4">
              {updateMode ? 'Update' : 'Add'} Video
            </Button>

            {error && <Error error={error} />}
          </form>
        )
      }}
    </Formik>
  )
}

export default VideoForm
