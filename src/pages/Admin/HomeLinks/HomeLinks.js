import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Modal } from 'react-bootstrap'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject, deleteAccents } from 'utils/utils'
import * as Api from 'api/api'
import { FileURL } from 'utils/config'
import { STATUS, STATUS_OBJ } from 'utils/constants'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './HomeLinks.module.scss'
import saga from './saga'
import {
  makeSelectHomeLinksData,
} from './selectors'
import reducer, {
  getHomeLinks,
} from './slices'
import LinkForm from './components/LinkForm'
import Status from '../Users/components/Status'

const mapStateToProps = createStructuredSelector({
  homeLinksData: makeSelectHomeLinksData(),
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

const HomeLinks = ({ location }) => {
  /**
   * inject saga và reducer vào hệ thống
   * */
  useInjectSaga({ key: 'homeLinks', saga })
  useInjectReducer({ key: 'homeLinks', reducer })

  const dispatch = useDispatch()

  /**
   * state
   */
  const [showForm, setShowForm] = useState(false)
  const [selectedLink, setSelectedLink] = useState()

  /**
   * get data
   */
  const getData = () => {

  }

  useEffect(() => {
    dispatch(getHomeLinks())
  }, [])

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
    homeLinksData,
  } = useSelector(mapStateToProps)

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
    dispatch(getHomeLinks())
  }

  const handleShowEditUser = (item) => {
    setSelectedLink(item)
    setShowForm(true)
  }

  const tableOptions = useMemo(() => [{
    name: 'avatar',
    label: 'Image',
    renderCol: (item) => (
      <img src={`${FileURL}${item.avatar}`} className={classes.image} alt="img" />
    )
  }, {
    name: 'title',
    label: 'Title',
  }, {
    name: 'desc',
    label: 'Mô tả',
  }, {
    name: 'urL_LINK',
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

  const data = useMemo(() => {
    const params = convertSearchParamsToObject(location.search)

    const newResults = homeLinksData?.results ? homeLinksData.results.filter((item) => (
      (!params.textSearch || deleteAccents(`${item.title} ${item.desc}`).toLowerCase()
        .indexOf(deleteAccents(decodeURI(params.textSearch)).toLowerCase()) !== -1)
      && (!params.status || item.status === params.status)
    )) : []

    return {
      ...homeLinksData,
      results: newResults
    }
  }, [homeLinksData, location.search])

  return (
    <div className={classes.container}>
      <AdminPage
        data={data}
        filter={filter}
        handleSearch={handleSearch}
        filterOptions={filterOptions}
        tableOptions={tableOptions}
        handleAddNew={() => {
          setSelectedLink(null)
          setShowForm(true)
        }}
      />

      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        size="md"
      >
        <LinkForm
          initialValues={selectedLink ? {
            ...selectedLink,
            avatar: {
              url: selectedLink.avatar
            }
          } : {}}
          handleClose={() => setShowForm(false)}
          handlerefreshData={handlerefreshData}
          selectedLink={selectedLink}
        />
      </Modal>
    </div>
  )
}

export default HomeLinks
