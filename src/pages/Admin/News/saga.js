import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getNewsSuccess,
  getNewsFailure,
  GET_NEWS,
} from './slices'

export function* getNews({ params, screen }) {
  try {
    let status = ''
    if (screen === 'DRAFT') {
      status = 'Unit'
    } else if (screen === 'DELETE') {
      status = 'Delete'
    } else if (screen === 'WAITING_APPROVE') {
      status = 'Submit'
    } else if (screen === 'APPROVED') {
      status = 'Approved'
    } else if (screen === 'REJECTED') {
      status = 'Reject'
    }

    const result = yield call(Api.get, {
      url: '/api/News/admin-search',
      params: {
        ...params,
        page: params.page || 1,
        size: params.size || 10,
        status
      }
    })

    yield put(getNewsSuccess(result))
  } catch (e) {
    console.log('e', e)
    yield put(getNewsFailure())
  }
}

export default function* watchUsersData() {
  yield takeLatest(GET_NEWS, getNews)
}
