import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getCloneLinksSuccess,
  getCloneLinksFailure,
  GET_CLONE_LINKS,
} from './slices'

export function* getCloneLinks({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/WebLink/admin-client-search',
      params: {
        ...params,
        page: params.page || 1,
        size: params.size || 10,
        type: 'N'
      }
    })

    yield put(getCloneLinksSuccess(result))
  } catch (e) {
    yield put(getCloneLinksFailure())
  }
}

export default function* watchHomeLinksData() {
  yield takeLatest(GET_CLONE_LINKS, getCloneLinks)
}
