import React, { useState, useEffect } from 'react'
import {
  Field,
  reduxForm,
} from 'redux-form'
import InputField from 'components/InputField'
import SelectField from 'components/SelectField'
import Button from 'components/Button'
import * as Api from 'api/api'
import { validateEmail, validatePhoneNumber } from 'utils/validators'
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
          {(selectedUser && selectedUser.id) ? 'C???p nh???t user' : 'T???o user' }
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
          label="Quy???n"
          options={roles}
          loading={loadingRoles}
          required
        />
        <Field
          name="userName"
          component={InputField}
          label="T??n ????ng nh???p"
          required
        />
        <Field
          name="fullName"
          component={InputField}
          label="H??? v?? t??n"
          required
        />
        { !(selectedUser
          && selectedUser.id)
          && (
          <Field
            name="passWord"
            component={InputField}
            label="M???t kh???u"
            type="password"
            required
          />
          )}

        <Field
          name="phoneNumber"
          component={InputField}
          label="??i???n tho???i"
          inputType="number"
          maxLength={10}
        />

        <Field
          name="email"
          component={InputField}
          label="Email"
        />

        <Field
          name="department"
          component={InputField}
          label="Ph??ng ban"
        />

      </div>
      <div className={classes.actions}>
        <Button
          className="btn btnMain btnLarge"
          loading={loading}
          type="submit"
        >
          {(selectedUser && selectedUser.id) ? 'C???p nh???t user' : 'T???o user' }
        </Button>
      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.userName || !values.userName.trim()) {
    errors.userName = 'Vui l??ng nh???p t??n ????ng nh???p'
  }

  if (!values.id && (!values.passWord || !values.passWord.trim())) {
    errors.passWord = 'Vui l??ng nh???p m???t kh???u'
  }

  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = 'Vui l??ng nh???p H??? t??n'
  }

  if (!values.role) {
    errors.role = 'Vui l??ng ch???n role'
  }

  if (values.email && !validateEmail(values.email)) {
    errors.email = 'Vui l??ng nh???p Email h???p l???'
  }

  if (values.phoneNumber && !validatePhoneNumber(values.phoneNumber)) {
    errors.phoneNumber = 'Vui l??ng nh???p s??? ??i???n tho???i h???p l???'
  }

  return errors
}

export default reduxForm({
  form: 'UserForm',
  validate,
  enableReinitialize: true
})(UserForm)
