export const GET_CATEGORIES = 'admin/Category/getCategories'
export const GET_CATEGORIES_SUCCESS = 'admin/Category/getCategoriesSuccess'
export const GET_CATEGORIES_FAILURE = 'admin/Category/getCategoriesFailure'

export const getCategories = (params) => ({
  type: GET_CATEGORIES,
  params
})

export const getCategoriesSuccess = (data) => ({
  type: GET_CATEGORIES_SUCCESS,
  data
})

export const getCategoriesFailure = () => ({
  type: GET_CATEGORIES_FAILURE
})

export const initialState = {
  categoryData: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        loading: true
      }
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categoryData: action.data,
        loading: false
      }
    case GET_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
