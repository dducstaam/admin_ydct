import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Field, reduxForm, getFormValues } from 'redux-form'
import Button from 'components/Button'
import InputField from 'components/InputField'
import QuillField from 'components/QuillField'
import SwitchField from 'components/SwitchField'
import DropzoneUploader from 'components/DropzoneUploader'
import { createStructuredSelector } from 'reselect'
import { useSelector, useDispatch } from 'react-redux'
import * as Api from 'api/api'
import SelectField from 'components/SelectField'
import DatePickerField from 'components/DatePickerField'
import moment from 'moment'
import history from 'utils/history'
import { showNotification } from 'layout/CommonLayout/actions'
import { CropImageField } from 'components/CropImageField/CropImageField'
import classes from './NewsForm.module.scss'
import SelectCategories from './SelectCategories'

const mapStateToProps = createStructuredSelector({
  formState: (state) => getFormValues('NewsForm')(state) || {}
})

const NewsForm = ({ match, handleSubmit, change }) => {
  const userInfo = useMemo(() => JSON.parse(localStorage.getItem('userInfo')), [])
  const formRef = useRef(null)
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [types, setTypes] = useState([])
  const [detail, setDetail] = useState()

  const [loading, setLoading] = useState(false)

  const { formState } = useSelector(mapStateToProps)

  const dispatch = useDispatch()

  useEffect(async () => {
    try {
      setLoadingTypes(true)

      const result = await Api.get({
        url: '/api/Type'
      })

      console.log('result', result)

      setTypes(result.map((item) => ({
        ...item,
        label: item.desc,
        value: item.typE_ID
      })))

      setLoadingTypes(false)
    } catch (e) {
      setLoadingTypes(false)
    }
  }, [])

  useEffect(async () => {
    try {
      if (match.params?.id) {
        const result = await Api.get({
          url: `/api/News/${match.params?.id}`
        })
        change('avatar', { url: result.data.avatar })
        change('categories', result.data.categories)
        change('titlE_CODE', result.data.titlE_CODE)
        change('title', result.data.title)
        change('shorT_CONTENT', result.data.shorT_CONTENT)
        change('contents', result.data.contents)
        change('issuE_DATE', result.data.issuE_DATE && moment(result.data.issuE_DATE).format('DD/MM/YYYY'))
        change('iS_HOST', result.data.iS_HOST === 'Y')
        change('alloW_COMMENT', result.data.alloW_COMMENT === 'Y')

        setDetail(result.data)
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }, [])

  useEffect(() => {
    if (detail && types && types.length > 0) {
      const type = types.find((item) => item.value === detail.typE_ID)
      change('typE_ID', type)
      if (type.name === 'VIDEO') {
        change('youtubeURL', detail.documentAttacks[0]?.documenT_LINK)
      } else {
        change('documentAttacks', detail.documentAttacks && detail.documentAttacks.map((item) => ({
          url: item.documenT_LINK,
          fileName: item.documenT_NAME
        })))
      }
    }
  }, [detail, types])

  const handleSubmitNews = async (values) => {
    try {
      setLoading(true)
      if (match.params?.id) {
        await Api.post({
          url: `/api/News/update/${match.params?.id}`,
          data: {
            ...values,
            newS_ID: +match.params?.id,
            typE_ID: values.typE_ID?.value,
            documentAttacks: values.typE_ID?.name === 'VIDEO'
              ? [{
                documenT_LINK: values.youtubeURL,
                documenT_NAME: 'youtube link'
              }]
              : (values.documentAttacks && values.documentAttacks.map((item) => ({
                documenT_LINK: item.url,
                documenT_NAME: item.fileName
              }))),
            iS_HOST: values.iS_HOST ? 'Y' : 'N',
            alloW_COMMENT: values.alloW_COMMENT ? 'Y' : 'N',
            issuE_DATE: moment(values.issuE_DATE, 'DD/MM/YYYY').toDate(),
            status: values.status || 'Submit',
            avatar: values.avatar?.url
          }
        })
        dispatch(showNotification({
          type: 'SUCCESS',
          message: 'C???p nh???t b??i vi???t th??nh c??ng'
        }))
      } else {
        await Api.post({
          url: '/api/News',
          data: {
            ...values,
            typE_ID: values.typE_ID?.value,
            documentAttacks: values.typE_ID?.name === 'VIDEO'
              ? [{
                documenT_LINK: values.youtubeURL,
                documenT_NAME: 'youtube link'
              }]
              : (values.documentAttacks && values.documentAttacks.map((item) => ({
                documenT_LINK: item.url,
                documenT_NAME: item.fileName
              }))),
            iS_HOST: values.iS_HOST ? 'Y' : 'N',
            alloW_COMMENT: values.alloW_COMMENT ? 'Y' : 'N',
            issuE_DATE: moment(values.issuE_DATE, 'DD/MM/YYYY').toDate(),
            status: values.status || 'Submit',
            avatar: values.avatar?.url
          }
        })

        dispatch(showNotification({
          type: 'SUCCESS',
          message: 'T???o b??i vi???t m???i th??nh c??ng'
        }))
      }

      if (values.status === 'Unit') {
        history.push('/admin/news/draft')
      } else {
        history.push('/admin/news/waiting-approve')
      }

      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(handleSubmitNews)}
      ref={formRef}
    >
      <div className="group">
        <div className={classes.header}>
          { match.params?.id ? 'C???p nh???t b??i b??o' : 'T???o b??i b??o' }
        </div>
        <div className={classes.content}>
          <Field
            name="avatar"
            label="???nh ?????i di???n"
            component={CropImageField}
            width={480}
            height={320}
          />
          <Field
            name="typE_ID"
            label="Lo???i b??i vi???t"
            component={SelectField}
            options={types}
            loading={loadingTypes}
          />
          <Field
            name="categories"
            label="Danh m???c"
            component={SelectCategories}
          />
          {
            formState.typE_ID?.name !== 'NEW'
            && formState.typE_ID?.name !== 'VIDEO'
            && (
            <Field
              name="titlE_CODE"
              component={InputField}
              label="M?? b??i vi???t"
            />
            )
          }

          <Field
            name="title"
            component={InputField}
            label="Ti??u d??? b??i vi???t"
          />
          <Field
            name="shorT_CONTENT"
            component={QuillField}
            label="N???i dung ng???n"
          />
          { (formState.typE_ID?.name === 'NEW')
            && (
            <Field
              name="contents"
              component={QuillField}
              label="N???i dung"
            />
            )}

          { (formState.typE_ID?.name === 'DOCUMENT')
            && (
            <Field
              name="issuE_DATE"
              component={DatePickerField}
              label="Ng??y ban h??nh"
              viewMode="days"
            />
            )}
          <Field
            name="iS_HOST"
            component={SwitchField}
            label="B??i vi???t hot"
          />
          <Field
            name="alloW_COMMENT"
            component={SwitchField}
            label="???????c b??nh lu???n"
          />
          { (formState.typE_ID?.name === 'DOCUMENT')
            && (
            <Field
              name="documentAttacks"
              component={DropzoneUploader}
              label="T??i li???u"
            />
            )}
          { formState.typE_ID?.name === 'VIDEO'
            && (
              <Field
                name="youtubeURL"
                component={InputField}
                label="Link youtube"
                placeholder="Nh???p link youtube"
              />
            )}

        </div>
        { detail?.status !== 'Approve'
          && (
          <div className={classes.actions}>
            <Button
              className="btn btnLarge btnSecond mr20"
              type="submit"
              loading={loading}
              onClick={() => {
                change('status', 'Unit')
              }}
            >
              L??u nh??p
            </Button>
            <Button
              className="btn btnMain btnLarge"
              type="submit"
              loading={loading}
              onClick={() => {
                if (userInfo.role === 'VietBai') {
                  change('status', 'Submit')
                } else {
                  change('status', 'Approved')
                }
              }}
            >
              Xu???t b???n
            </Button>
          </div>
          )}

      </div>

    </form>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.typE_ID) {
    errors.typE_ID = 'Vui l??ng ch???n lo???i b??i vi???t'
  }

  if (!values.categories) {
    errors.categories = 'Vui l??ng ch???n danh m???c'
  }

  if (!values.titlE_CODE || !values.titlE_CODE.trim()) {
    errors.titlE_CODE = 'Vui l??ng nh???p m?? b??i vi???t'
  }

  if (!values.title || !values.title.trim()) {
    errors.title = 'Vui l??ng nh???p ti??u ?????'
  }

  if (!values.shorT_CONTENT || !values.shorT_CONTENT.trim()) {
    errors.shorT_CONTENT = 'Vui l??ng nh???p n???i dung ng???n'
  }

  if (values.typE_ID?.name === 'NEW' && (!values.contents || !values.contents.trim())) {
    errors.contents = 'Vui l??ng nh???p n???i dung'
  }

  if (values.typE_ID?.name === 'VIDEO' && !values.youtubeURL) {
    errors.youtubeURL = 'Vui l??ng link youtube'
  }

  if (values.typE_ID?.name === 'DOCUMENT' && !values.issuE_DATE) {
    errors.issuE_DATE = 'Vui l??ng ch???n ng??y ban h??nh'
  }

  return errors
}

export default reduxForm({
  form: 'NewsForm',
  validate
})(NewsForm)
