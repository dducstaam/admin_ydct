import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as Api from 'api/api'
// import { convertSearchParamsToObject } from 'utils/utils'
import InputField from 'components/InputField';
import history from 'utils/history';
import { useDispatch } from 'react-redux';
import { showNotification } from 'layout/CommonLayout/actions';
import classes from './ChangePassword.module.scss'
import Button from '../../components/Button';

const messages = defineMessages({
  password: {
    id: 'ForgotPassword.ChangePassword.password',
    defaultMessage: 'Mật khẩu mới'
  },
  confirmPassword: {
    id: 'ForgotPassword.ChangePassword.confirmPassword',
    defaultMessage: 'Xác nhận mật khẩu mới'
  },
  passwordInvalid: {
    id: 'ForgotPassword.ChangePassword.passwordInvalid',
    defaultMessage: 'Mật khẩu không hợp lệ'
  }
})

const ChangePassword = (props) => {
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const { handleSubmit, match } = props

  const handleChangePassword = async (values) => {
    try {
      setLoading(true)
      await Api.post({
        url: '/api/reset-password',
        data: {
          ...values,
          token: match.params?.token
        }
      })
      dispatch(showNotification({
        type: 'SUCCESS',
        message: 'Thay đổi mật khẩu thành công'
      }))
      setLoading(false)
      history.push('/auth/login')
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
          <FormattedMessage
            id="ForgotPassword.ChangePassword.title"
            defaultMessage="Thay đổi mật khẩu"
          />
        </p>
        <div className={classes.mb40}>
          <Field
            name="newPassword"
            component={InputField}
            type="password"
            placeholder={messages.password}
            label={messages.password}
            h50
            customClassEye={classes.eye}
          />

        </div>
        <Field
          name="confirmedNewPassword"
          component={InputField}
          placeholder={messages.confirmPassword}
          label={messages.confirmPassword}
          type="password"
          h50
          customClassEye={classes.eye}
        />

        <div className={classes.actions}>
          <div className={classes.btnLoginWrapper}>
            <Button
              className="btn btnRed btnLarge w100"
              type="submit"
              loading={loading}
            >
              <FormattedMessage
                id="ChangePassword.send"
                defaultMessage="Gửi"
              />
            </Button>
          </div>
        </div>
        <Link
          to="/auth/login"
          className={classes.forgotPassword}
        >
          <FormattedMessage
            id="ChangePassword.login"
            defaultMessage="Đăng nhập?"
          />
        </Link>
      </form>
    </div>
  )
}

const validate = (values) => {
  const errors = {}
  if (!values.newPassword) {
    errors.newPassword = 'Vui lòng nhập mật khẩu mới'
  }
  if (!values.confirmedNewPassword) {
    errors.confirmedNewPassword = 'Vui lòng nhập xác nhận mật khẩu'
  } else if (values.confirmedNewPassword !== values.newPassword) {
    errors.confirmedNewPassword = 'Mật khẩu và xác nhận mật khẩu không giống nhau'
  }

  return errors
}

export default reduxForm({
  form: 'ChangePassword',
  validate
})(ChangePassword)
