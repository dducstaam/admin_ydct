import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectUsers = (state) => state.category || initialState

export const makeSelectCategoryData = () => createSelector(
  selectUsers,
  (state) => state.categoryData
)
