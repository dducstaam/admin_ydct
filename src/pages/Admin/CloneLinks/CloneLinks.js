import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Modal } from 'react-bootstrap'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject } from 'utils/utils'
import * as Api from 'api/api'
import { FileURL } from 'utils/config'
import { STATUS, STATUS_OBJ } from 'utils/constants'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './CloneLinks.module.scss'
import saga from './saga'
import {
  makeSelectCloneLinksData,
} from './selectors'
import reducer, {
  getCloneLinks,
} from './slices'
import LinkForm from './components/LinkForm'

const mapStateToProps = createStructuredSelector({
  cloneLinksData: makeSelectCloneLinksData(),
})

const filterOptions = [{
  type: 'SEARCH',
  name: 'title',
  label: 'Search...'
}, {
  type: 'SELECT',
  name: 'status',
  label: 'Status',
  options: STATUS
}]

const CloneLinks = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'cloneLinks', saga })
  useInjectReducer({ key: 'cloneLinks', reducer })

  /**
   * state
   */
  const [showCategoryForm, setShowCategotyForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState()

  /**
   * get data
   */
  const getData = (params) => {
    dispatch(getCloneLinks(params))
  }

  const convertQueryToFilter = (query) => ({
    ...query,
    status: query.status && {
      label: STATUS_OBJ[query.status],
      value: query.status
    }
  })

  const { filter, handleSearch } = useFilter({
    location,
    getData,
    convertQueryToFilter
  })

  const {
    cloneLinksData,
  } = useSelector(mapStateToProps)

  const dispatch = useDispatch()

  const handleChangeStatus = (active, item) => {
    dispatch(handleShowConfirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn thay đổi trạng thái link này?',
      handleOk: async () => {
        try {
          await Api.get({
            url: `/api/WebLink/update-status/${item.websitE_ID}/${active ? 'Y' : 'N'}`,
          })

          handlerefreshData()
        } catch (e) {
          return Promise.reject(e)
        }
      }
    }))
  }

  const handlerefreshData = () => {
    const params = convertSearchParamsToObject(location.search)
    dispatch(getCloneLinks(params))
  }

  const handleShowEditUser = (item) => {
    setSelectedCategory(item)
    setShowCategotyForm(true)
  }

  const tableOptions = useMemo(() => [{
    name: 'avatar',
    label: 'Ảnh đại diện',
    renderCol: (item) => (
      <img src={`${FileURL}${item.avatar}`} className={classes.image} alt="img" />
    )
  }, {
    name: 'title',
    label: 'Tên đơn vị',
  }, {
    name: 'desc',
    label: 'Mô tả',
  }, {
    name: 'urL_LINK',
    label: 'Link liên kết',
  }, {
    name: 'status',
    label: 'Trạng thái',
  }, {
    type: 'ACTION',
    name: 'action',
    handleChangeStatus,
    handleEdit: handleShowEditUser,
    status: 'Y'
  }], [])

  return (
    <div className={classes.container}>
      <AdminPage
        data={cloneLinksData}
        filter={filter}
        handleSearch={handleSearch}
        filterOptions={filterOptions}
        tableOptions={tableOptions}
        handleAddNew={() => {
          setSelectedCategory(null)
          setShowCategotyForm(true)
        }}
      />

      <Modal
        show={showCategoryForm}
        onHide={() => setShowCategotyForm(false)}
        size="md"
      >
        <LinkForm
          initialValues={selectedCategory || {}}
          handleClose={() => setShowCategotyForm(false)}
          handlerefreshData={handlerefreshData}
          selectedCategory={selectedCategory}
        />
      </Modal>
    </div>
  )
}

export default CloneLinks
