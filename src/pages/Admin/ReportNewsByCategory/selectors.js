import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectNews = (state) => state.reportNewsByCategory || initialState

export const makeSelectReportNewsData = () => createSelector(
  selectNews,
  (state) => state.reportNewsData
)
