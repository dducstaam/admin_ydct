import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject } from 'utils/utils'
import * as Api from 'api/api'
import history from 'utils/history'
import { Modal } from 'react-bootstrap'
import RejectReason from 'components/RejectReason'
import moment from 'moment'
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
import Status from './components/Status'

const mapStateToProps = createStructuredSelector({
  usersData: makeSelectNewsData(),
})

const filterOptions = [{
  type: 'SEARCH',
  name: 'title',
  label: 'Search...'
}]

const News = ({ location, screen }) => {
  const userInfo = useMemo(() => JSON.parse(localStorage.getItem('userInfo')), [])
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'news', saga })
  useInjectReducer({ key: 'news', reducer })

  const [showReject, setShowReject] = useState(false)
  const [selectedNews, setSelectedNews] = useState()

  /**
   * get data
   */
  const getData = (params) => {
    // console.log('prams===>', params, type)
    dispatch(getNews(params, screen))
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

  const handleRefreshNews = () => {
    const params = convertSearchParamsToObject(location.search)
    dispatch(getNews(params, screen))
  }

  const handleApprove = (item) => {
    dispatch(handleShowConfirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn Phê duyệt bài viết này',
      handleOk: async () => {
        try {
          await Api.get({
            url: `/api/News/update-status/${item.newS_ID}/Approved`,
          })

          handleRefreshNews()
        } catch (e) {
          return Promise.reject(e)
        }
      }
    }))
  }

  const handleReject = (item) => {
    setSelectedNews(item)
    setShowReject(true)
  }

  const handleRemove = (item) => {
    dispatch(handleShowConfirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn xoá bài viết này',
      handleOk: async () => {
        try {
          await Api.get({
            url: `/api/News/update-status/${item.newS_ID}/Delete`,
          })

          handleRefreshNews()
        } catch (e) {
          return Promise.reject(e)
        }
      }
    }))
  }

  const handleSubmitReject = async (reason) => {
    try {
      await Api.get({
        url: `/api/News/update-status/${selectedNews.newS_ID}/Reject`,
        params: {
          reason
        }
      })
      setShowReject(false)
      handleRefreshNews()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const tableOptions = useMemo(() => [{
    name: 'createD_DATE',
    label: 'Ngày tạo',
    renderCol: (item) => moment(item.createD_DATE).format('DD/MM/YYYY')
  }, {
    name: 'title',
    label: 'Tiêu đề',
    renderCol: (item) => (
      <p className={classes.title}>
        { item.title }
      </p>
    )
  }, {
    name: 'category_desc',
    label: 'Danh mục',
  }, {
    name: 'createD_BY',
    label: 'Người tạo',
  }, {
    name: 'approveD_BY',
    label: 'Người duyệt',
  }, {
    name: 'alloW_COMMENT',
    label: 'Được bình luận',
  }, {
    name: 'status',
    label: 'Trạng thái',
    renderCol: (item) => (
      <div className={classes.statusWrapper}>
        <Status status={item.status} />
        { item.status === 'Reject' && (
        <p className={classes.reason}>
          { item.reason }
        </p>
        ) }
      </div>
    )
  }, {
    type: 'ACTION',
    name: 'action',
    handleEdit: screen !== 'APPROVED' && ((item) => (
      history.push(`/admin/news/form/${item.newS_ID}`)
    )),
    handleRemove: screen !== 'DELETE' && handleRemove,
    handleApprove: userInfo.role !== 'VietBai' && screen === 'WAITING_APPROVE' && handleApprove,
    handleReject: userInfo.role !== 'VietBai' && screen === 'WAITING_APPROVE' && handleReject,
    status: 'Y'
  }], [location.pathname, userInfo])

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

      <Modal
        show={showReject}
        onHide={() => {
          setShowReject(false)
        }}
      >
        <RejectReason
          title="Từ chối bài viết"
          reasons={[{
            code: 'REJECT1',
            title: 'Không đúng chính tả'
          }, {
            code: 'REJECT2',
            title: 'Không đúng danh mục'
          }, {
            code: 'OTHER',
            title: 'Khác'
          }]}
          handleClose={() => {
            setShowReject(false)
          }}
          handleReject={handleSubmitReject}
        />
      </Modal>
    </div>
  )
}

export default News
