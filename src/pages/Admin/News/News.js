import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject } from 'utils/utils'
import * as Api from 'api/api'
import history from 'utils/history'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './News.module.scss'
import saga from './saga'
import {
  makeSelectNewsData,
} from './selectors'
import reducer, {
  getNews,
} from './slices'

const mapStateToProps = createStructuredSelector({
  usersData: makeSelectNewsData(),
})

const filterOptions = [{
  type: 'SEARCH',
  name: 'title',
  label: 'Search...'
}]

const Users = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'news', saga })
  useInjectReducer({ key: 'news', reducer })

  /**
   * get data
   */
  const getData = (params) => {
    dispatch(getNews(params))
  }

  const convertQueryToFilter = (query) => ({
    ...query
  })

  const { filter, handleSearch } = useFilter({
    location,
    getData,
    convertQueryToFilter
  })

  const {
    usersData,
  } = useSelector(mapStateToProps)

  const dispatch = useDispatch()

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
    dispatch(getNews(params))
  }

  const tableOptions = useMemo(() => [{
    name: 'createD_DATE',
    label: 'Ngày tạo',
  }, {
    name: 'title',
    label: 'Tiêu đề',
  }, {
    name: 'alloW_COMMENT',
    label: 'Được bình luận',
  }, {
    name: 'createD_BY',
    label: 'Tạo bởi',
  }, {
    name: 'approveD_BY',
    label: 'Duyệt bởi',
  }, {
    name: 'category_name',
    label: 'Danh mục',
  }, {
    name: 'status',
    label: 'Trạng thái',
  }, {
    type: 'ACTION',
    name: 'action',
    handleChangeStatus,
    handleEdit: (item) => (
      history.push(`/admin/news/form/${item.newS_ID}`)
    ),
    status: 'Y'
  }], [])

  return (
    <div className={classes.container}>
      <AdminPage
        data={usersData}
        filter={filter}
        handleSearch={handleSearch}
        filterOptions={filterOptions}
        tableOptions={tableOptions}
        handleAddNew={() => {
          history.push('/admin/news/form')
        }}
      />
    </div>
  )
}

export default Users
