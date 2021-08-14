export const GET_NEWS = 'admin/News/getNews'
export const GET_NEWS_SUCCESS = 'admin/News/getNewsSuccess'
export const GET_NEWS_FAILURE = 'admin/News/getNewsFailure'

export const getNews = (params) => ({
  type: GET_NEWS,
  params
})

export const getNewsSuccess = (data) => ({
  type: GET_NEWS_SUCCESS,
  data
})

export const getNewsFailure = () => ({
  type: GET_NEWS_FAILURE
})

export const initialState = {
  newsData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_NEWS:
      return {
        ...state,
        loading: true
      }
    case GET_NEWS_SUCCESS:
      return {
        ...state,
        newsData: action.data,
        loading: false
      }
    case GET_NEWS_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
