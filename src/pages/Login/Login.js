import React, { useState, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import * as Api from 'api/api'
import { showNotification } from 'layout/CommonLayout/actions'
// import Cookies from 'js-cookie'
import InputField from 'components/InputField';
import { connect } from 'react-redux'
import history from 'utils/history'
import Button from '../../components/Button';
import classes from './Login.module.scss'
// import { convertSearchParamsToObject } from 'utils/utils'

const Login = (props) => {
  const [loading, setLoading] = useState(false)

  const redirect = useMemo(() => {
    const redirect = window.location.href.split('?redirect=')[1]
    return redirect
  }, [window.location.href])

  const handleLogin = async (values) => {
    try {
      setLoading(true)

      const result = await Api.post({
        url: '/api/UserYte/login',
        data: values
      })

      localStorage.setItem('accessToken', result.data.token)
      localStorage.setItem('userInfo', JSON.stringify(result.data))

      history.push(redirect || '/admin/users')

      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  // console.log('searchObj ====> ', redirect)

  const { handleSubmit } = props
  return (
    <div className={classes.content}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className={classes.title}>
          <FormattedMessage
            id="Login.titleAdmin"
            defaultMessage="Đăng nhập"
          />

        </div>
        <div className={classes.mb40}>
          <Field
            name="userName"
            component={InputField}
            placeholder="Tên đăng nhập"
            // hideError={true}
            h50
            label="Tên đăng nhập"
          />
        </div>

        <Field
          name="password"
          component={InputField}
          type="password"
          placeholder="Mật khẩu đăng nhập"
          // hideError={true}
          h50
          label="Mật khẩu"
          customClassEye={classes.eye}
        />
        <div className={classes.btnLoginWrapper}>
          <Button
            className="btn btnRed btnLarge w100"
            type="submit"
            loading={loading}
          >
            Đăng nhập
          </Button>
        </div>

        <div className={classes.forgotPassword}>
          <Link to="/auth/forgot-password">
            <FormattedMessage
              id="Login.forgotPassword"
              defaultMessage="Quên mật khẩu?"
            />
          </Link>
        </div>
      </form>
    </div>
  )
}

const validate = (values) => {
  const errors = {}
  if (!values.userName) {
    errors.userName = 'Vui lòng nhập tên đăng nhập'
  }

  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
  }

  return errors
}

const LoginForm = reduxForm({
  form: 'Login',
  validate
})(Login)

export default connect(null, (dispatch) => ({
  showNotification: (notification) => dispatch(showNotification(notification)),
}))(LoginForm)
