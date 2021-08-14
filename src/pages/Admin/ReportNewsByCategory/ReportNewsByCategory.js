import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import moment from 'moment'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './ReportNewsByCategory.module.scss'
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

const Users = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'reportNewsByCategory', saga })
  useInjectReducer({ key: 'reportNewsByCategory', reducer })

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
    }
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
    name: 'name',
    label: 'Sub menu',
  }, {
    name: 'description',
    label: 'Submenu Description',
  }, {
    name: 'total_new',
    label: 'Số lượng bài',
    renderCol: (item) => (
      item.total_new || 0
    )
  }], [])

  return (
    <div className={classes.container}>
      <AdminPage
        data={reportNewsData}
        filter={filter}
        handleSearch={handleSearch}
        tableOptions={tableOptions}
      />
    </div>
  )
}

export default Users
