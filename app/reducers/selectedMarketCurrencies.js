import {
  CHANGE_SELECTED_MARKET_CURRENCIES,
} from '../actions/selectedMarketCurrencies'
const config = require('../config')
const defaultState = config.defaultState.selectedMarketCurrencies

export default function selectedMarketCurrencies(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SELECTED_MARKET_CURRENCIES:
      return Object.assign({}, action.selections)
    default:
      return state
  }
}

