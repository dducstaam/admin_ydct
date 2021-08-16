import {
  put,
  takeLatest,
  call
} from 'redux-saga/effects'
import * as Api from 'api/api'
import {
  getSettingsFailure,
  getSettingsSuccess,
  GET_SETTINGS,
} from './slices'

export function* getSettings({ params }) {
  try {
    const result = yield call(Api.get, {
      url: '/api/Confugration',
      params: {
        ...params,
        page: params?.page || 1,
        size: params?.size || 10
      }
    })

    yield put(getSettingsSuccess({
      results: result,
      rowCount: result.length
    }))
  } catch (e) {
    console.log('e')
    yield put(getSettingsFailure())
  }
}

export default function* watchSettingsData() {
  yield takeLatest(GET_SETTINGS, getSettings)
}
