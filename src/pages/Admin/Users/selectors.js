import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectUsers = (state) => state.users || initialState

export const makeSelectUsersData = () => createSelector(
  selectUsers,
  (state) => state.usersData
)

export const selectPageInfo = () => createSelector(
  selectUsers,
  (state) => state.pageInfo
)

export const selectLoading = () => createSelector(
  selectUsers,
  (state) => state.loading
)

export const selectFilterObj = () => createSelector(
  selectUsers,
  (state) => state.filterObj
)

export const selectQuery = () => createSelector(
  selectUsers,
  (state) => state.query
)

export const makeSelectSelectedUser = () => createSelector(
  selectUsers,
  (state) => state.selectedUser
)

export const selectShowRejectReason = () => createSelector(
  selectUsers,
  (state) => state.showRejectReason
)
