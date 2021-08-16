import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Modal } from 'react-bootstrap'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject, deleteAccents } from 'utils/utils'
import * as Api from 'api/api'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './Settings.module.scss'
import saga from './saga'
import {
  makeSelectSettingsData,
} from './selectors'
import reducer, {
  getSettings,
} from './slices'
import SettingsForm from './components/SettingsForm'
import ValueCol from './components/ValueCol'

const mapStateToProps = createStructuredSelector({
  settingsData: makeSelectSettingsData(),
})

const filterOptions = [{
  type: 'SEARCH',
  name: 'textSearch',
  label: 'Search...'
}]

const Settings = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'settings', saga })
  useInjectReducer({ key: 'settings', reducer })

  const dispatch = useDispatch()

  /**
   * state
   */
  const [showForm, setShowForm] = useState(false)

  /**
   * get data
   */
  const getData = () => {

  }

  useEffect(() => {
    dispatch(getSettings())
  }, [])

  const convertQueryToFilter = (query) => ({
    textSearch: query.textSearch || '',
  })

  const { filter, handleSearch } = useFilter({
    location,
    getData,
    convertQueryToFilter
  })

  const {
    settingsData,
  } = useSelector(mapStateToProps)

  const handleRemove = (item) => {
    dispatch(handleShowConfirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn xoá tham số này?',
      handleOk: async () => {
        try {
          await Api.get({
            url: `/api/Confugration/delete/${item.confugratioN_ID}`,
          })

          handlerefreshData()
        } catch (e) {
          return Promise.reject(e)
        }
      }
    }))
  }

  const handlerefreshData = () => {
    dispatch(getSettings())
  }

  const tableOptions = useMemo(() => [{
    name: 'confugratioN_CODE',
    label: 'Mã tham số',
  }, {
    name: 'desc',
    label: 'Tên tham số',
  }, {
    name: 'value',
    label: 'Giá trị',
    renderCol: (item) => <ValueCol item={item} />
  }, {
    type: 'ACTION',
    name: 'action',
    handleRemove,
  }], [])

  const data = useMemo(() => {
    const params = convertSearchParamsToObject(location.search)

    const newResults = settingsData?.results ? settingsData.results.filter((item) => (
      (!params.textSearch || deleteAccents(`${item.confugratioN_CODE} ${item.desc}`).toLowerCase()
        .indexOf(deleteAccents(decodeURI(params.textSearch)).toLowerCase()) !== -1)
    )) : []

    return {
      ...settingsData,
      results: newResults
    }
  }, [settingsData, location.search])

  return (
    <div className={classes.container}>
      <AdminPage
        data={data}
        filter={filter}
        handleSearch={handleSearch}
        filterOptions={filterOptions}
        tableOptions={tableOptions}
        handleAddNew={() => {
          setShowForm(true)
        }}
      />

      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        size="md"
      >
        <SettingsForm
          handleClose={() => setShowForm(false)}
          handlerefreshData={handlerefreshData}
        />
      </Modal>
    </div>
  )
}

export default Settings
