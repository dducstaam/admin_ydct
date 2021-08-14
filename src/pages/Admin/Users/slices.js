export const GET_USERS = 'admin/Users/getUsers'
export const GET_USERS_SUCCESS = 'admin/Users/getUsersSuccess'
export const GET_USERS_FAILURE = 'admin/Users/getUsersFailure'
export const REQUEST_FILTER = 'admin/Users/requestFilter'
export const OPEN_USER_FORM = 'admin/Users/openUserForm'
export const CLOSE_USER_FORM = 'admin/Users/closeUserForm'
export const SUBMIT_USER_FORM = 'admin/Users/submitUserForm'
export const SUBMIT_USER_FORM_SUCCESS = 'admin/Users/submitUserFormSuccess'
export const SUBMIT_USER_FORM_FAILURE = 'admin/Users/submitUserFormFailure'
export const CHANGE_STATUS = 'admin/Users/changeStatus'
export const OPEN_REJECT_REASON = 'admin/Users/openRejectReason'
export const CLOSE_REJECT_REASON = 'admin/Users/closeRejectReason'

export const getUsers = (params) => ({
  type: GET_USERS,
  params
})

export const getUsersSuccess = (data) => ({
  type: GET_USERS_SUCCESS,
  data
})

export const getUsersFailure = () => ({
  type: GET_USERS_FAILURE
})

export const requestFilter = ({ filterObj, query }) => ({
  type: REQUEST_FILTER,
  filterObj,
  query
})

export const changeStatus = (item) => ({
  type: CHANGE_STATUS,
  item
})

export const openRejectReason = (selectedUser) => ({
  type: OPEN_REJECT_REASON,
  selectedUser
})

export const closeRejectReason = () => ({
  type: CLOSE_REJECT_REASON
})

export const initialState = {
  usersData: {},
  pageInfo: {},
  loading: false,
  showRejectReason: false,
  selectedUser: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        loading: true
      }
    case GET_USERS_SUCCESS:
      return {
        ...state,
        usersData: action.data,
        loading: false
      }
    case GET_USERS_FAILURE:
      return {
        ...state,
        loading: false
      }
    case OPEN_REJECT_REASON:
      return {
        ...state,
        showRejectReason: true,
        selectedUser: action.selectedUser
      }
    case CLOSE_REJECT_REASON:
      return {
        ...state,
        showRejectReason: false
      }
    default:
      return state
  }
}
