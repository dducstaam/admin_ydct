import React, { useState } from 'react'
import {
  Field,
  reduxForm,
} from 'redux-form'
import InputField from 'components/InputField'
import Button from 'components/Button'
import * as Api from 'api/api'
import closeIcon from 'images/close.svg'
import classes from './SettingsForm.module.scss'

const SettingsForm = ({ handleSubmit, handleClose, handlerefreshData }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmitUser = async (values) => {
    try {
      setLoading(true)

      await Api.post({
        url: '/api/Confugration',
        data: {
          ...values,
        }
      })
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
          Tạo tham số mới
        </h2>
        <a
          className={classes.btnClose}
          onClick={handleClose}
        >
          <img src={closeIcon} className={classes.closeIcon} alt="closeIcon" />
        </a>
      </div>
      <div className={classes.content}>

        <Field
          name="confugratioN_CODE"
          component={InputField}
          label="Mã tham số"
          required
        />
        <Field
          name="desc"
          component={InputField}
          label="Tên tham số"
          required
        />
        <Field
          name="value"
          component={InputField}
          label="Giá trị"
          required
        />
      </div>
      <div className={classes.actions}>
        <Button
          className="btn btnMain btnLarge"
          loading={loading}
          type="submit"
        >
          Tạo tham số
        </Button>
      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.confugratioN_CODE || !values.confugratioN_CODE.trim()) {
    errors.userName = 'Vui lòng nhập mã tham số'
  }

  if (!values.desc || !values.desc.trim()) {
    errors.userName = 'Vui lòng nhập tên tham số'
  }

  if (!values.value || !values.value.trim()) {
    errors.userName = 'Vui lòng nhập giá trị'
  }

  return errors
}

export default reduxForm({
  form: 'SettingsForm',
  validate,
  enableReinitialize: true
})(SettingsForm)
