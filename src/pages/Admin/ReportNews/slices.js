export const GET_REPORT_NEWS = 'admin/ReportNews/getReportNews'
export const GET_REPORT_NEWS_SUCCESS = 'admin/ReportNews/getReportNewsSuccess'
export const GET_REPORT_NEWS_FAILURE = 'admin/ReportNews/getReportNewsFailure'

export const getReportNews = (params) => ({
  type: GET_REPORT_NEWS,
  params
})

export const getReportNewsSuccess = (data) => ({
  type: GET_REPORT_NEWS_SUCCESS,
  data
})

export const getReportNewsFailure = () => ({
  type: GET_REPORT_NEWS_FAILURE
})

export const initialState = {
  reportNewsData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_REPORT_NEWS:
      return {
        ...state,
        loading: true
      }
    case GET_REPORT_NEWS_SUCCESS:
      return {
        ...state,
        reportNewsData: action.data,
        loading: false
      }
    case GET_REPORT_NEWS_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
