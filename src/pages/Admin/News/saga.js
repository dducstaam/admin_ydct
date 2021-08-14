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

export function* getNews({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/News/admin-search',
      params: {
        ...params,
        page: params.page || 1,
        size: params.size || 10
      }
    })

    yield put(getNewsSuccess(result))
  } catch (e) {
    yield put(getNewsFailure())
  }
}

export default function* watchUsersData() {
  yield takeLatest(GET_NEWS, getNews)
}
