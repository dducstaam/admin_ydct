import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectHomeLinks = (state) => state.homeLinks || initialState

export const makeSelectHomeLinksData = () => createSelector(
  selectHomeLinks,
  (state) => state.homeLinksData
)
