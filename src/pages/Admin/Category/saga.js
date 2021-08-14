import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getCategoriesSuccess,
  getCategoriesFailure,
  GET_CATEGORIES,
} from './slices'

export function* getCategories({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/Category',
      params: {
        ...params,
      }
    })

    console.log('result', result)

    yield put(getCategoriesSuccess({
      results: result,
      currentPage: 1,
      rowCount: result.length,
      pageCount: 1
    }))
  } catch (e) {
    yield put(getCategoriesFailure())
  }
}

export default function* watchUsersData() {
  yield takeLatest(GET_CATEGORIES, getCategories)
}
