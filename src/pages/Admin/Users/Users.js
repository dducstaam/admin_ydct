import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Modal } from 'react-bootstrap'
import { handleShowConfirm } from 'layout/CommonLayout/actions'
import { useFilter } from 'hooks/useFilter'
import AdminPage from 'components/AdminPage'
import { convertSearchParamsToObject, deleteAccents } from 'utils/utils'
import * as Api from 'api/api'
import { STATUS, STATUS_OBJ } from 'utils/constants'
import { useInjectReducer } from '../../../utils/injectReducer'
import { useInjectSaga } from '../../../utils/injectSaga'
import classes from './Users.module.scss'
import saga from './saga'
import {
  makeSelectUsersData,
} from './selectors'
import reducer, {
  getUsers,
} from './slices'
import UserForm from './components/UserForm'
import Status from './components/Status'

const mapStateToProps = createStructuredSelector({
  usersData: makeSelectUsersData(),
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
  useInjectSaga({ key: 'users', saga })
  useInjectReducer({ key: 'users', reducer })

  /**
   * state
   */
  const [showUserForm, setShowUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState()

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
    usersData,
  } = useSelector(mapStateToProps)

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  useEffect(() => {
    if (usersData && usersData.results?.length > 0) {
      const params = convertSearchParamsToObject(location.search)

      const newResults = usersData.results.filter((item) => (
        !params.textSearch || deleteAccents(`${item.userName} ${item.email} ${item.fullName}`).toLowerCase()
          .indexOf(deleteAccents(decodeURI(params.textSearch)).toLowerCase()) !== -1
      ) && (!params.status || item.status === params.status))

      setData({
        ...usersData,
        results: newResults
      })
    }
  }, [location.search, usersData])

  const dispatch = useDispatch()

  const handleChangeStatus = (active, item) => {
    dispatch(handleShowConfirm({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn thay đổi trạng thái người dùng này?',
      handleOk: async () => {
        try {
          await Api.get({
            url: `/api/UserYte/update-status/${active ? 'Y' : 'N'}`,
            params: {
              id: item.id
            }
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
    dispatch(getUsers(params))
  }

  const handleShowEditUser = (item) => {
    setSelectedUser(item)
    setShowUserForm(true)
  }

  const tableOptions = useMemo(() => [{
    name: 'userName',
    label: 'Tên đăng nhập',
  }, {
    name: 'fullName',
    label: 'Họ tên',
  }, {
    name: 'phoneNumber',
    label: 'Số điện thoại',
  }, {
    name: 'email',
    label: 'Email',
  }, {
    name: 'department',
    label: 'Phòng ban',
  }, {
    name: 'role',
    label: 'Quyền',
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
          setSelectedUser(null)
          setShowUserForm(true)
        }}
      />

      <Modal
        show={showUserForm}
        onHide={() => setShowUserForm(false)}
        size="md"
      >
        <UserForm
          initialValues={selectedUser || {}}
          handleClose={() => setShowUserForm(false)}
          handleRefreshUser={handleRefreshUser}
          selectedUser={selectedUser}
        />
      </Modal>
    </div>
  )
}

export default Users
