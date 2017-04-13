import {
  CHANGE_SELECTED_SHOP_CURRENCIES,
} from '../actions/selectedShopCurrencies'
const config = require('../config')
const defaultState = config.defaultState.selectedShopCurrencies

export default function selectedShopCurrencies(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SELECTED_SHOP_CURRENCIES:
      return Object.assign({}, action.selections)
    default:
      return state
  }
}

