import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectNews = (state) => state.reportNews || initialState

export const makeSelectReportNewsData = () => createSelector(
  selectNews,
  (state) => state.reportNewsData
)
