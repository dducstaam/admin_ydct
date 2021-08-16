import { createSelector } from 'reselect'
import { initialState } from './slices'

export const selectSettings = (state) => state.settings || initialState

export const makeSelectSettingsData = () => createSelector(
  selectSettings,
  (state) => state.settingsData
)
