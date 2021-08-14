import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getUsersSuccess,
  getUsersFailure,
  getUsers,
  GET_USERS,
  CHANGE_STATUS
} from './slices'

export function* watchUsers({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/UserYte',
      params: {
        ...params,
      }
    })

    yield put(getUsersSuccess({
      results: result,
      currentPage: 1,
      rowCount: result.length,
      pageCount: 1
    }))
  } catch (e) {
    yield put(getUsersFailure())
  }
}

function* changeStatus({ item }) {
  try {
    yield call(Api.put, {
      url: `/admin/private/user/change-status/${item._id}`,
      data: {
        status: item.status,
        note: item.reason
      }
    })
    yield put(getUsers())
  } catch (e) {
    console.log(e)
  }
}

export default function* watchUsersData() {
  yield takeLatest(GET_USERS, watchUsers)
  yield takeLatest(CHANGE_STATUS, changeStatus)
}
