import React, { useState } from 'react'
import { Field, reduxForm } from 'redux-form'
import * as Api from 'api/api'
import InputField from 'components/InputField';
import Button from 'components/Button';
import history from 'utils/history'
import classes from './ChangePassword.module.scss'

const ChangePassword = (props) => {
  const [loading, setLoading] = useState(false)

  const { handleSubmit } = props

  const handleChangePassword = async (values) => {
    try {
      setLoading(true)

      await Api.post({
        url: '/api/UserYte/change-password',
        data: {
          ...values,
          PassWord: values.newPassword
        }
      })

      localStorage.clear()
      history.push('/auth/login')

      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <div className={classes.content}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(handleChangePassword)}
      >
        <p className={classes.title}>
          Thay đổi mật khẩu
        </p>
        <div className={classes.mb40}>
          <Field
            name="oldPassword"
            component={InputField}
            type="password"
            placeholder="Mật khẩu cũ"
            label="Mật khẩu cũ"
            h50
            customClassEye={classes.eye}
          />

        </div>
        <div className={classes.mb40}>
          <Field
            name="newPassword"
            component={InputField}
            type="password"
            placeholder="Mật khẩu mới"
            label="Mật khẩu mới"
            h50
            customClassEye={classes.eye}
          />

        </div>
        <Field
          name="confirmedNewPassword"
          component={InputField}
          placeholder="Xác nhận Mật khẩu mới"
          label="Xác nhận Mật khẩu mới"
          type="password"
          h50
          customClassEye={classes.eye}
        />

        <div className={classes.actions}>
          <div className={classes.btnLoginWrapper}>
            <Button
              className="btn btnMain btnLarge w100"
              type="submit"
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

const validate = (values) => {
  const errors = {}
  if (!values.oldPassword) {
    errors.oldPassword = 'Vui lòng nhập mật khẩu cũ'
  }

  if (!values.newPassword) {
    errors.newPassword = 'Vui lòng nhập mật khẩu mới'
  } if (values.newPassword === values.oldPassword) {
    errors.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ'
  }

  if (!values.confirmedNewPassword) {
    errors.confirmedNewPassword = 'Vui lòng nhập xác nhận mật khẩu'
  } else if (values.confirmedNewPassword !== values.newPassword) {
    errors.confirmedNewPassword = 'Hai mật khẩu không giống nhau'
  }

  return errors
}

export default reduxForm({
  form: 'ChangePassword',
  validate
})(ChangePassword)
