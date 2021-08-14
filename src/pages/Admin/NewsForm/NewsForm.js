import React, { useState, useEffect } from 'react'
import { Field, reduxForm, getFormValues } from 'redux-form'
import Button from 'components/Button'
import InputField from 'components/InputField'
import QuillField from 'components/QuillField'
import SwitchField from 'components/SwitchField'
import DropzoneUploadImage from 'components/DropzoneUploadImage'
import { createStructuredSelector } from 'reselect'
import { useSelector } from 'react-redux'
import * as Api from 'api/api'
import SelectField from 'components/SelectField'
import DatePickerField from 'components/DatePickerField'
import classes from './NewsForm.module.scss'

const mapStateToProps = createStructuredSelector({
  formState: (state) => getFormValues('NewsForm')(state) || {}
})

const NewsForm = ({ match, handleSubmit }) => {
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [types, setTypes] = useState([])

  const [loading, setLoading] = useState(false)

  const { formState } = useSelector(mapStateToProps)

  useEffect(async () => {
    try {
      setLoadingTypes(true)

      const result = await Api.get({
        url: '/api/Type'
      })

      setTypes(result.map((item) => ({
        ...item,
        label: item.desc,
        value: item.typE_ID
      })))

      setLoadingTypes(false)
    } catch (e) {
      setLoadingTypes(false)
    }
  }, [])

  const handleSubmitNews = async (values) => {
    try {
      setLoading(true)
      if (match.id) {
        await Api.post({
          url: `/api/News/update/${match.id}`,
          data: values
        })
      } else {
        await Api.post({
          url: '/api/News',
          data: values
        })
      }

      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(handleSubmitNews)}
    >
      <div className="group">
        <div className={classes.header}>
          { match.id ? 'Cập nhật bài báo' : 'Tạo bài báo' }
        </div>
        <div className={classes.content}>
          <Field
            name="typE_ID"
            label="Loại bài viết"
            component={SelectField}
            options={types}
            loading={loadingTypes}
          />
          <Field
            name="categories"
            label="Danh mục"
            component={SelectField}
            options={types}
            loading={loadingTypes}
          />
          <Field
            name="titlE_CODE"
            component={InputField}
            label="Mã bài viết"
          />
          <Field
            name="title"
            component={InputField}
            label="Tiêu dề bài viết"
          />
          <Field
            name="shorT_CONTENT"
            component={QuillField}
            label="Nội dung ngắn"
          />
          <Field
            name="contents"
            component={QuillField}
            label="Nội dung"
          />
          { (formState.typE_ID?.name === 'DOCUMENT')
            && (
            <Field
              name="issuE_DATE"
              component={DatePickerField}
              label="Ngày ban hành"
              viewMode="days"
            />
            )}
          <Field
            name="iS_HOST"
            component={SwitchField}
            label="Bài viết hot"
          />
          <Field
            name="alloW_COMMENT"
            component={SwitchField}
            label="Được bình luận"
          />
          { (formState.typE_ID?.name === 'VIDEO' || formState.typE_ID?.name === 'DOCUMENT')
            && (
            <Field
              name="documentAttacks"
              component={DropzoneUploadImage}
              label="Tài liệu"
            />
            )}

        </div>
        <div className={classes.actions}>
          <Button
            className="btn btnMain btnLarge"
            type="submit"
            loading={loading}
          >
            { match.id ? 'Cập nhật' : 'Tạo' }
          </Button>
        </div>
      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.titlE_CODE || !values.titlE_CODE.trim()) {
    errors.titlE_CODE = 'Vui lòng nhập mã bài viết'
  }

  if (!values.title || !values.title.trim()) {
    errors.title = 'Vui lòng nhập tiêu đề'
  }

  if (!values.shorT_CONTENT || !values.shorT_CONTENT.trim()) {
    errors.titlE_CODE = 'Vui lòng nhập nội dung ngắn'
  }

  if (!values.contents || !values.contents.trim()) {
    errors.contents = 'Vui lòng nhập nội dung'
  }

  return errors
}

export default reduxForm({
  form: 'NewsForm',
  validate
})(NewsForm)
