import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectNews = (state) => state.news || initialState

export const makeSelectNewsData = () => createSelector(
  selectNews,
  (state) => state.newsData
)
