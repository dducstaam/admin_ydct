import React, { useState, useEffect } from 'react'
import {
  Field,
  reduxForm,
} from 'redux-form'
import InputField from 'components/InputField'
import SelectField from 'components/SelectField'
import Button from 'components/Button'
import * as Api from 'api/api'
import { validateEmail } from 'utils/validators'
import closeIcon from 'images/close.svg'
import classes from './UserForm.module.scss'

const UserForm = ({ handleSubmit, handleClose, handleRefreshUser, selectedUser, change }) => {
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    try {
      setLoadingRoles(true)
      const result = await Api.get({
        url: '/api/UserYte/list-role'
      })
      let selectedRole;
      setRoles(result.map((item) => {
        if (selectedUser && selectedUser.role && item.value === selectedUser.role) {
          selectedRole = {
            label: item.text,
            value: item.value
          }
        }
        return ({
          label: item.text,
          value: item.value
        })
      }))
      if (selectedRole) {
        change('role', selectedRole)
      }

      setLoadingRoles(false)
    } catch (e) {
      setLoadingRoles(false)
    }
  }, [])

  const handleSubmitUser = async (values) => {
    try {
      setLoading(true)

      if (values.id) {
        await Api.post({
          url: `/api/UserYte/update/${values.id}`,
          data: {
            ...values,
            role: values.role.value
          }
        })
      } else {
        await Api.post({
          url: '/api/UserYte',
          data: {
            ...values,
            role: values.role.value
          }
        })
      }
      handleRefreshUser()
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
          {(selectedUser && selectedUser.id) ? 'Cập nhật user' : 'Tạo user' }
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
          name="role"
          component={SelectField}
          label="Role"
          options={roles}
          loading={loadingRoles}
        />
        <Field
          name="userName"
          component={InputField}
          label="Tên đăng nhập"
        />
        { !(selectedUser
          && selectedUser.id)
          && (
          <Field
            name="passWord"
            component={InputField}
            label="Mật khẩu"
            type="password"
          />
          )}

        <Field
          name="email"
          component={InputField}
          label="Email"
        />
        <Field
          name="fullName"
          component={InputField}
          label="Họ và tên"
        />
      </div>
      <div className={classes.actions}>
        <Button
          className="btn btnMain btnLarge"
          loading={loading}
          type="submit"
        >
          {(selectedUser && selectedUser.id) ? 'Cập nhật user' : 'Tạo user' }
        </Button>
      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.userName || !values.userName.trim()) {
    errors.userName = 'Vui lòng nhập tên đăng nhập'
  }

  if (!values.id && (!values.passWord || !values.passWord.trim())) {
    errors.passWord = 'Vui lòng nhập mật khẩu'
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Vui lòng nhập Email'
  } else if (!validateEmail(values.email)) {
    errors.email = 'Vui lòng nhập Email hợp lệ'
  }

  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập Họ tên'
  }

  if (!values.role) {
    errors.role = 'Vui lòng chọn role'
  }

  return errors
}

export default reduxForm({
  form: 'UserForm',
  validate,
  enableReinitialize: true
})(UserForm)
