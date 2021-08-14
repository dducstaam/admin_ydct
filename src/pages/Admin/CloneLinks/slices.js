export const GET_CLONE_LINKS = 'admin/CloneLinks/getCloneLinks'
export const GET_CLONE_LINKS_SUCCESS = 'admin/CloneLinks/getCloneLinksSuccess'
export const GET_CLONE_LINKS_FAILURE = 'admin/CloneLinks/getCloneLinksFailure'

export const getCloneLinks = (params) => ({
  type: GET_CLONE_LINKS,
  params
})

export const getCloneLinksSuccess = (data) => ({
  type: GET_CLONE_LINKS_SUCCESS,
  data
})

export const getCloneLinksFailure = () => ({
  type: GET_CLONE_LINKS_FAILURE
})

export const initialState = {
  cloneLinksData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CLONE_LINKS:
      return {
        ...state,
        loading: true
      }
    case GET_CLONE_LINKS_SUCCESS:
      return {
        ...state,
        cloneLinksData: action.data,
        loading: false
      }
    case GET_CLONE_LINKS_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
