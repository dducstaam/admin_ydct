import React, { useState, useEffect } from 'react'
import {
  Field,
  reduxForm,
} from 'redux-form'
import InputField from 'components/InputField'
import Button from 'components/Button'
import * as Api from 'api/api'
import closeIcon from 'images/close.svg'
import SelectField from 'components/SelectField'
import classes from './CategoryForm.module.scss'

const CategoryForm = ({ handleSubmit, handleClose, handleRefreshUser, selectedCategory, change }) => {
  const [subMenus, setSubMenus] = useState([])
  const [loadingSubMenus, setLoadingSubMenus] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    try {
      setLoadingSubMenus(true)

      const result = await Api.get({
        url: '/api/Submenu/search-status/Y'
      })

      let selectedSubMenu = ''

      setSubMenus(result.map((item) => {
        if (selectedCategory && selectedCategory.submenU_ID === item.submenU_ID) {
          selectedSubMenu = {
            label: item.description,
            value: item.submenU_ID
          }
        }
        return ({
          label: item.description,
          value: item.submenU_ID
        })
      }))

      change('submenU_ID', selectedSubMenu)

      setLoadingSubMenus(false)
    } catch (e) {
      setLoadingSubMenus(false)
    }
  }, [])

  const handleSubmitUser = async (values) => {
    try {
      setLoading(true)

      if (values.categorY_ID) {
        await Api.post({
          url: `/api/Category/update/${values.categorY_ID}`,
          data: {
            ...values,
            submenU_ID: values.submenU_ID?.value,
          }
        })
      } else {
        await Api.post({
          url: '/api/Category',
          data: {
            ...values,
            submenU_ID: values.submenU_ID?.value,
            status: 'Y'
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
          { selectedCategory?.categorY_ID ? 'C???p nh???t danh m???c' : 'T???o danh m???c'}
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
          name="submenU_ID"
          component={SelectField}
          label="Danh m???c cha"
          options={subMenus}
          loading={loadingSubMenus}
          required
        />
        <Field
          name="name"
          component={InputField}
          label="T??n danh m???c"
          required
        />

        <Field
          name="desc"
          component={InputField}
          label="M?? t???"
        />
        <Field
          name="urL_NAME"
          component={InputField}
          label="URL"
        />
      </div>
      <div className={classes.actions}>
        <Button
          className="btn btnMain btnLarge"
          loading={loading}
          type="submit"
        >
          { selectedCategory?.categorY_ID ? 'C???p nh???t danh m???c' : 'T???o danh m???c'}
        </Button>
      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.submenU_ID) {
    errors.submenU_ID = 'Vui l??ng ch???n danh m???c cha'
  }

  if (!values.name || !values.name.trim()) {
    errors.name = 'Vui l??ng nh???p t??n danh m???c'
  }

  return errors
}

export default reduxForm({
  form: 'CategoryForm',
  validate,
  enableReinitialize: true
})(CategoryForm)
