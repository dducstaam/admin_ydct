export const GET_SETTINGS = 'admin/Settings/getSettings'
export const GET_SETTINGS_SUCCESS = 'admin/Settings/getSettingsSuccess'
export const GET_SETTINGS_FAILURE = 'admin/Settings/getSettingsFailure'

export const getSettings = (params) => ({
  type: GET_SETTINGS,
  params
})

export const getSettingsSuccess = (data) => ({
  type: GET_SETTINGS_SUCCESS,
  data
})

export const getSettingsFailure = () => ({
  type: GET_SETTINGS_FAILURE
})

export const initialState = {
  settingsData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS:
      return {
        ...state,
        loading: true
      }
    case GET_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsData: action.data,
        loading: false
      }
    case GET_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
