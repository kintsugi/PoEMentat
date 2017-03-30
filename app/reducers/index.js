// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import ready from './ready'
import settings from './settings'
import currencyTypes from './currencyTypes'
import inventory from './inventory'

const rootReducer = combineReducers({
  ready,
  settings,
  currencyTypes,
  inventory,
  routing
})

export default rootReducer
