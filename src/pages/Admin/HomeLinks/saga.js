import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getHomeLinksSuccess,
  getHomeLinksFailure,
  GET_HOME_LINKS,
} from './slices'

export function* getHomeLinks({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/WebLink',
      params: {
        ...params,
        page: params?.page || 1,
        size: params?.size || 10
      }
    })

    yield put(getHomeLinksSuccess({
      results: result.filter((item) => item.typE_LINK === 'L')
    }))
  } catch (e) {
    console.log('e')
    yield put(getHomeLinksFailure())
  }
}

export default function* watchHomeLinksData() {
  yield takeLatest(GET_HOME_LINKS, getHomeLinks)
}
