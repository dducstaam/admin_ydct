import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getReportNewsSuccess,
  getReportNewsFailure,
  GET_REPORT_NEWS,
} from './slices'

export function* getReportNews({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/News/report-news',
      params: {
        ...params,
      }
    })

    yield put(getReportNewsSuccess({
      results: result,
      currentPage: 1,
      rowCount: result.length,
      pageCount: 1
    }))
  } catch (e) {
    yield put(getReportNewsFailure())
  }
}

export default function* watchNewsData() {
  yield takeLatest(GET_REPORT_NEWS, getReportNews)
}
