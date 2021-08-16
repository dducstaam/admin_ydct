import React, { useState, useEffect } from 'react'
import {
  Field,
  reduxForm,
  getFormValues
} from 'redux-form'
import InputField from 'components/InputField'
import Button from 'components/Button'
import * as Api from 'api/api'
import closeIcon from 'images/close.svg'
import { createStructuredSelector } from 'reselect'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import CropImageField from 'components/CropImageField'
import classes from './LinkForm.module.scss'

const mapStateToProps = createStructuredSelector({
  formState: (state) => getFormValues('LinkFormClone')(state) || {}
})

const LinkForm = ({ handleSubmit, handleClose, handlerefreshData, selectedLink, change }) => {
  const [showCropImage, setShowCropImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingCraw, setLoadingCraw] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowCropImage(true)
    }, 0)
  }, [])

  const { formState } = useSelector(mapStateToProps)

  const handleSubmitUser = async (values) => {
    try {
      setLoading(true)

      if (values.websitE_ID) {
        await Api.post({
          url: `/api/WebLink/update/${values.websitE_ID}`,
          data: {
            ...values,
            avatar: values?.avatar?.url
          }
        })
      } else {
        await Api.post({
          url: '/api/WebLink',
          data: {
            ...values,
            typE_LINK: 'N',
            status: 'Y',
            avatar: values?.avatar?.url
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

  const crawLink = async () => {
    try {
      setLoadingCraw(true)
      const url = formState.urL_LINK
      const result = await Api.get({
        url: '/api/Util/craw',
        params: {
          url
        }
      })

      change('title', result.title)
      change('desc', result.description)
      change('avatar', { url: result.linkImage[0] })

      setLoadingCraw(false)
    } catch (e) {
      setLoadingCraw(false)
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
        <div className={classes.row}>
          <div className={classes.col}>
            <Field
              name="urL_LINK"
              component={InputField}
              label="Link"

            />
          </div>

          <Button
            type="button"
            className={classNames(classes.btn, 'btn btnBlue btnSmall')}
            loading={loadingCraw}
            onClick={crawLink}
          >
            Craw
          </Button>
        </div>

        { showCropImage
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
  form: 'LinkFormClone',
  validate,
  enableReinitialize: true
})(LinkForm)
