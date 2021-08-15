import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as Api from 'api/api'
import { connect } from 'react-redux'
import InputField from 'components/InputField';
import { showNotification } from 'layout/CommonLayout/actions';
// import { hideEmail } from 'utils/utils';
import classes from './ForgotPassword.module.scss'
import Button from '../../components/Button';
import { validateEmail, validatePhoneNumber } from '../../utils/validators';

const messages = defineMessages({
  email: {
    id: 'ForgotPassword.email',
    defaultMessage: 'Địa chỉ email hoặc số điện thoại'
  },
  emailEmpty: {
    id: 'ForgotPassword.emailEmpty',
    defaultMessage: 'Vui lòng nhập email hoặc số điện thoại'
  },
  emailInvalid: {
    id: 'ForgotPassword.emailInvalid',
    defaultMessage: 'Vui lòng nhập email hoặc số điện thoại hợp lệ'
  },
  businessCode: {
    id: 'ForgotPassword.businessCode',
    defaultMessage: 'Giấy đăng ký kinh doanh'
  }
})

const ForgotPassword = (props) => {
  const { handleSubmit, showNotification } = props

  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (values) => {
    // console.log(values)
    try {
      setLoading(true)
      await Api.post({
        url: '/api/forgot-password',
        data: {
          userName: values.username
        }
      })
      setLoading(false)
      showNotification({
        type: 'SUCCESS',
        message: 'Yêu cầu được gửi thành công. Vui lòng kiểm tra email để thay đổi mật khẩu'
      })
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <div className={classes.content}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <p className={classes.title}>
          <FormattedMessage
            id="ForgotPassword.title"
            defaultMessage="Quên mật khẩu"
          />
        </p>
        <div className={classes.mb40}>
          <Field
            name="username"
            component={InputField}
            placeholder="Nhập tên đăng nhập để lấy lại mật khẩu"
            h50
            label="Tên đăng nhập"
          />
        </div>
        <div className={classes.actions}>
          <div className={classes.btnLoginWrapper}>
            <Button
              className="btn btnRed btnLarge w100"
              type="submit"
              loading={loading}
            >
              <FormattedMessage
                id="ForgotPassword.send"
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
            id="ForgotPassword.login"
            defaultMessage="Đăng nhập?"
          />
        </Link>
      </form>
    </div>
  )
}

const validate = (values) => {
  const errors = {}
  if (!values.username) {
    errors.username = messages.emailEmpty
  } else if (!validateEmail(values.username) && !validatePhoneNumber(values.username)) {
    errors.username = messages.emailInvalid
  }
  return errors
}

const ForgotPasswordForm = reduxForm({
  form: 'ForgotPassword',
  validate
})(ForgotPassword)

const mapDispatchToProps = (dispatch) => ({
  showNotification: (notification) => dispatch(showNotification(notification))
})

export default connect(null, mapDispatchToProps)(ForgotPasswordForm)
