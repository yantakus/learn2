import React, { useState } from 'react'
import { Input, FormControl, FormLabel, Select, Button } from '@chakra-ui/core'
import qs from 'qs'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import CreatableSelect from 'react-select/creatable'

import { Player } from 'components'

type Props = {
  ytId?: string
  currentData?: object
}
const VideoForm: React.FC<Props> = (props) => {
  const updateMode = Boolean(props.currentData)
  const [ytId, setYtId] = useState(props.ytId)

  return (
    <Formik
      initialValues={{
        ytId: props.ytId,
        complexity: props.currentData.complexity,
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      {(formik) => {
        function handleYtIdChange(e) {
          formik.handleChange(e)
          const value = e.target.value
          if (value.startsWith('http')) {
            const queryString = value.substring(value.indexOf('?') + 1)
            const ytId = qs.parse(queryString).v
            if (ytId.length === 11) {
              setYtId(ytId)
            }
          } else if (value.length === 11) {
            setYtId(value)
          }
        }

        return (
          <form onSubmit={formik.handleSubmit}>
            <FormLabel htmlFor="ytId">Enter youtube video url or id</FormLabel>
            <Input
              id="ytId"
              name="ytId"
              onChange={handleYtIdChange}
              value={formik.values.ytId}
            />
            <Player ytId={ytId} />

            <FormLabel>Complexity</FormLabel>
            <CreatableSelect
              name="complexity"
              selection
              options={complexities}
              value={this.state.complexity}
              onChange={this.handleChange}
              required
              validationErrors={{
                isDefaultRequiredValue: 'This field is required',
              }}
              errorLabel={errorLabel}
            />

            <FormLabel>Language</FormLabel>
            <CreatableSelect
              name="language"
              options={languageOptions}
              search
              selection
              allowAdditions
              value={language}
              onAddItem={this.handleAddition}
              onChange={this.handleChange}
              required
              validationErrors={{
                isDefaultRequiredValue: 'This field is required',
              }}
              errorLabel={errorLabel}
            />

            <FormLabel>Topics</FormLabel>
            <CreatableSelect
              name="topics"
              options={topicsOptions}
              search
              selection
              fluid
              multiple
              allowAdditions
              value={topicsValue}
              required
              validations="minLength:1"
              validationErrors={{
                minLength: 'This field is required',
              }}
              errorLabel={errorLabel}
            />

            <FormLabel>Tags</FormLabel>
            <CreatableSelect
              name="tags"
              options={tagsOptions}
              search
              selection
              fluid
              multiple
              allowAdditions
              value={tagsValue}
              onAddItem={this.handleAddition}
              onChange={this.handleMultipleChange}
              required
              validations="minLength:1"
              validationErrors={{
                minLength: 'This field is required',
              }}
              errorLabel={errorLabel}
            />

            <Button
              type="submit"
              loading={loading}
              primary
              content={`${updateMode ? 'Update' : 'Add'} Video`}
            />
          </form>
        )
      }}
    </Formik>
  )
}

export default VideoForm
