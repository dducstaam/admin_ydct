import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Modal } from 'react-bootstrap'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject, deleteAccents } from 'utils/utils'
import * as Api from 'api/api'
import { STATUS_OBJ, STATUS } from 'utils/constants'
import moment from 'moment'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './Category.module.scss'
import saga from './saga'
import {
  makeSelectCategoryData,
} from './selectors'
import reducer, {
  getCategories,
} from './slices'
import CategoryForm from './components/CategoryForm'
import Status from '../Users/components/Status'

const mapStateToProps = createStructuredSelector({
  categoriesData: makeSelectCategoryData(),
})

const filterOptions = [{
  type: 'SEARCH',
  name: 'textSearch',
  label: 'Search...'
}, {
  type: 'SELECT',
  name: 'status',
  label: 'Status',
  options: STATUS
}]

const Users = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'category', saga })
  useInjectReducer({ key: 'category', reducer })

  const dispatch = useDispatch()

  /**
   * state
   */
  const [showCategoryForm, setShowCategotyForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState()
  const [data, setData] = useState()
  /**
   * get data
   */
  const getData = () => {

  }

  const convertQueryToFilter = (query) => ({
    textSearch: query.textSearch || '',
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
    categoriesData,
  } = useSelector(mapStateToProps)

  useEffect(() => {
    dispatch(getCategories())
  }, [])

  useEffect(() => {
    if (categoriesData && categoriesData.results?.length > 0) {
      const params = convertSearchParamsToObject(location.search)

      const newResults = categoriesData.results.filter((item) => (
        !params.textSearch || deleteAccents(`${item.name} ${item.desc}`).toLowerCase()
          .indexOf(deleteAccents(decodeURI(params.textSearch)).toLowerCase()) !== -1
      ) && (!params.status || item.status === params.status))

      setData({
        ...categoriesData,
        results: newResults
      })
    }
  }, [location.search, categoriesData])

  const handleChangeStatus = (active, item) => {
    dispatch(handleShowConfirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn thay đổi trạng thái danh mục này?',
      handleOk: async () => {
        try {
          await Api.get({
            url: `/api/Category/update-status/${item.categorY_ID}/${active ? 'Y' : 'N'}`,
          })

          handleRefreshUser()
        } catch (e) {
          return Promise.reject(e)
        }
      }
    }))
  }

  const handleRefreshUser = () => {
    const params = convertSearchParamsToObject(location.search)
    dispatch(getCategories(params))
  }

  const handleShowEditUser = (item) => {
    setSelectedCategory(item)
    setShowCategotyForm(true)
  }

  const tableOptions = useMemo(() => [{
    name: 'createD_DATE',
    label: 'Ngày tạo',
    renderCol: (item) => moment(item.createD_DATE).format('DD/MM/YYYY')
  }, {
    name: 'desc',
    label: 'Tên danh mục',
  }, {
    name: 'urL_NAME',
    label: 'URL',
  }, {
    name: 'status',
    label: 'Trạng thái',
    renderCol: (item) => <Status status={item.status} />
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
        data={data}
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
        <CategoryForm
          initialValues={selectedCategory || {}}
          handleClose={() => setShowCategotyForm(false)}
          handleRefreshUser={handleRefreshUser}
          selectedCategory={selectedCategory}
        />
      </Modal>
    </div>
  )
}

export default Users
