import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectCloneLinks = (state) => state.cloneLinks || initialState

export const makeSelectCloneLinksData = () => createSelector(
  selectCloneLinks,
  (state) => state.cloneLinksData
)
