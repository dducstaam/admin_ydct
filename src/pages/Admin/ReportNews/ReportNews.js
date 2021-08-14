import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import moment from 'moment'
import { convertSearchParamsToObject } from 'utils/utils'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './ReportNews.module.scss'
import saga from './saga'
import {
  makeSelectReportNewsData,
} from './selectors'
import reducer, {
  getReportNews,
} from './slices'

const mapStateToProps = createStructuredSelector({
  reportNewsData: makeSelectReportNewsData(),
})

const filterOptions = [{
  type: 'RANGER_DATE',
  name: 'date',
}]

const Users = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'reportNews', saga })
  useInjectReducer({ key: 'reportNews', reducer })

  /**
   * get data
   */
  const getData = (params) => {
    dispatch(getReportNews(params))
  }

  const convertQueryToFilter = (query) => ({
    date: (query.dateBegin || query.dateEnd) && {
      from: query.dateBegin && moment(query.dateBegin).format('DD/MM/YYYY'),
      to: query.dateEnd && moment(query.dateEnd).format('DD/MM/YYYY')
    },
    sort: query.sort,
    sortType: query.sortType
  })

  const { filter, handleSearch } = useFilter({
    location,
    getData,
    convertQueryToFilter
  })

  const {
    reportNewsData,
  } = useSelector(mapStateToProps)

  const dispatch = useDispatch()

  const tableOptions = useMemo(() => [{
    name: 'publisH_DATE',
    label: 'Ngày xuất bản',
  }, {
    name: 'title',
    label: 'Tiêu đề',
    renderCol: (item) => (
      <p className={classes.title}>
        { item.title }
      </p>
    )
  }, {
    name: 'createD_BY',
    label: 'Tạo bởi',
  }, {
    name: 'likE_NEW',
    label: 'Số likes',
    renderCol: (item) => (
      item.likE_NEW || 0
    ),
    allowSort: true
  }, {
    name: 'comment_NEW',
    label: 'Số Comments',
    renderCol: (item) => (
      item.comment_NEW || 0
    ),
    allowSort: true
  }, {
    name: 'reaD_NEW',
    label: 'Số Đọc',
    renderCol: (item) => (
      item.reaD_NEW || 0
    ),
    allowSort: true
  }], [])

  const data = useMemo(() => {
    const params = convertSearchParamsToObject(location.search)
    let newResults = reportNewsData.results
    if (params.sort && reportNewsData.results?.length > 0) {
      newResults = [...reportNewsData.results].sort((a, b) => {
        if (params.sortType === 'ASC') {
          return a[params.sort] - b[params.sort]
        }
        return b[params.sort] - a[params.sort]
      })
    }

    return {
      ...reportNewsData,
      results: newResults
    }
  }, [reportNewsData, location.search])

  return (
    <div className={classes.container}>
      <AdminPage
        data={data}
        filter={filter}
        handleSearch={handleSearch}
        filterOptions={filterOptions}
        tableOptions={tableOptions}
      />
    </div>
  )
}

export default Users
