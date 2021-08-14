export const GET_HOME_LINKS = 'admin/HomeLinks/getHomeLinks'
export const GET_HOME_LINKS_SUCCESS = 'admin/HomeLinks/getHomeLinksSuccess'
export const GET_HOME_LINKS_FAILURE = 'admin/HomeLinks/getHomeLinksFailure'

export const getHomeLinks = (params) => ({
  type: GET_HOME_LINKS,
  params
})

export const getHomeLinksSuccess = (data) => ({
  type: GET_HOME_LINKS_SUCCESS,
  data
})

export const getHomeLinksFailure = () => ({
  type: GET_HOME_LINKS_FAILURE
})

export const initialState = {
  homeLinksData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_HOME_LINKS:
      return {
        ...state,
        loading: true
      }
    case GET_HOME_LINKS_SUCCESS:
      return {
        ...state,
        homeLinksData: action.data,
        loading: false
      }
    case GET_HOME_LINKS_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
