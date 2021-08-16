import React, { useState, useEffect } from 'react'
import {
  Field,
  reduxForm,
} from 'redux-form'
import InputField from 'components/InputField'
import Button from 'components/Button'
import * as Api from 'api/api'
import closeIcon from 'images/close.svg'
import CropImageField from 'components/CropImageField'
import classes from './LinkForm.module.scss'

const LinkForm = ({ handleSubmit, handleClose, handlerefreshData, selectedLink }) => {
  const [showCropImage, setShowCropImage] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowCropImage(true)
    }, 0)
  }, [])

  const handleSubmitUser = async (values) => {
    try {
      setLoading(true)

      if (values.websitE_ID) {
        await Api.post({
          url: `/api/WebLink/update/${values.websitE_ID}`,
          data: {
            ...values,
            avatar: values?.avatar?.url,
          }
        })
      } else {
        await Api.post({
          url: '/api/WebLink',
          data: {
            ...values,
            typE_LINK: 'L',
            avatar: values?.avatar?.url,
            status: 'Y'
          }
        })
      }
      handlerefreshData()
      handleClose()
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(handleSubmitUser)}
    >
      <div className={classes.head}>
        <h2 className={classes.title}>
          { selectedLink?.websitE_ID ? 'Cập nhật link' : 'Tạo link'}
        </h2>
        <a
          className={classes.btnClose}
          onClick={handleClose}
        >
          <img src={closeIcon} className={classes.closeIcon} alt="closeIcon" />
        </a>
      </div>
      <div className={classes.content}>
        {showCropImage
          && (
          <Field
            name="avatar"
            component={CropImageField}
            label="Ảnh đại diện"
            width={200}
            height={200}
          />
          )}

        <Field
          name="urL_LINK"
          component={InputField}
          label="Link liên kết"
        />
        <Field
          name="title"
          component={InputField}
          label="Tên đơn vị"
        />
        <Field
          name="desc"
          component={InputField}
          label="Mô tả"
        />
      </div>
      <div className={classes.actions}>
        <Button
          className="btn btnMain btnLarge"
          loading={loading}
          type="submit"
        >
          { selectedLink?.websitE_ID ? 'Cập nhật link' : 'Tạo link'}
        </Button>
      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.urL_NAME || !values.urL_NAME.trim()) {
    errors.userName = 'Vui lòng nhập URL'
  }

  if (!values.name || !values.name.trim()) {
    errors.fullName = 'Vui lòng nhập tên danh mục'
  }

  return errors
}

export default reduxForm({
  form: 'LinkForm',
  validate,
  enableReinitialize: true
})(LinkForm)
