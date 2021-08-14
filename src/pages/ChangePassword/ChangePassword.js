import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as Api from 'api/api'
// import { convertSearchParamsToObject } from 'utils/utils'
import InputField from 'components/InputField';
import history from 'utils/history';
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

  const { handleSubmit } = props

  const handleChangePassword = async (values) => {
    try {
      setLoading(true)
      const result = await Api.put({
        url: `/link/active/${props.match.params.token}`,
        data: values
      })
      localStorage.setItem('accessToken', result.data.token)
      localStorage.setItem('roles', result.data.roles)
      localStorage.setItem('idCustomer', result.data._id)

      localStorage.setItem('userInfo', JSON.stringify({
        email: result.data.email,
        phoneNumber: result.data.phoneNumber,
        fullName: result.data.fullName,
        city: result.data.city,
        district: result.data.district,
        ward: result.data.ward,
        address: result.data.address,
      }))

      if (result.data.roles.indexOf('CUSTOMER') !== -1) {
        history.push('/')
      } else {
        const roles = await Api.get({
          url: '/admin/private/user-roles'
        })

        const pageRoles = {}

        let path = null

        const showMenus = {
          showOverview: false,
          showCar: false,
          showProduct: false,
          showInsurance: false,
          showUnit: false,
          showRegtry: false,
          showCustomer: false,
          showSetting: false,
          showReport: false
        }

        if (roles.data && roles.data.pages && roles.data.pages.length > 0) {
          roles.data.pages.forEach((page) => {
            if (page.permissions && page.permissions.indexOf('VIEW') !== -1) {
              if (!path) {
                path = page.path
              }
              if (page.group?.value === 1) {
                showMenus.showOverview = true
              } else if (page.group?.value === 2) {
                showMenus.showCar = true
              } else if (page.group?.value === 3) {
                showMenus.showProduct = true
              } else if (page.group?.value === 4) {
                showMenus.showInsurance = true
              } else if (page.group?.value === 5) {
                showMenus.showUnit = true
              } else if (page.group?.value === 6) {
                showMenus.showRegtry = true
              } else if (page.group?.value === 7) {
                showMenus.showCustomer = true
              } else if (page.group?.value === 8) {
                showMenus.showSetting = true
              } else if (page.group?.value === 9) {
                showMenus.showReport = true
              }
            }
            pageRoles[page.pageCode] = page.permissions
          })
        }
        localStorage.setItem('pageRoles', JSON.stringify(pageRoles))
        localStorage.setItem('showMenus', JSON.stringify(showMenus))
        localStorage.setItem('firstPath', (path || '/'))
        history.push(path || '/')
      }
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
    errors.newPassword = messages.passwordInvalid
  }
  if (!values.confirmedNewPassword || values.confirmedNewPassword !== values.newPassword) {
    errors.confirmedNewPassword = messages.passwordInvalid
  }

  return errors
}

export default reduxForm({
  form: 'ChangePassword',
  validate
})(ChangePassword)
