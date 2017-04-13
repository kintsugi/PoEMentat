// @flow
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import ready from './ready'
import settings from './settings'
import currencyTypes from './currencyTypes'
import inventory from './inventory'
import offers from './offers'
import markets from './markets'
import shop from './shop'
import marketCurrencyFilter from './marketCurrencyFilter'
import shopCurrencyFilter from './shopCurrencyFilter'
import selectedMarketCurrencies from './selectedMarketCurrencies'
import selectedShopCurrencies from './selectedShopCurrencies'

const rootReducer = combineReducers({
  ready,
  settings,
  currencyTypes,
  inventory,
  offers,
  markets,
  shop,
  marketCurrencyFilter,
  shopCurrencyFilter,
  selectedMarketCurrencies,
  selectedShopCurrencies,
  routing
})

export default rootReducer
