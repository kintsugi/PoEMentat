// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import ready from './ready'
import settings from './settings'
import currencyTypes from './currencyTypes'
import inventory from './inventory'
import offers from './offers'
import currencyFilter from './currencyFilter'
import selectedCurrencies from './selectedCurrencies'

const rootReducer = combineReducers({
  ready,
  settings,
  currencyTypes,
  inventory,
  offers,
  currencyFilter,
  selectedCurrencies,
  routing
})

export default rootReducer
