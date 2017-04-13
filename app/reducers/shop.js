import {
  CHANGE_SHOP,
  CHANGE_SHOP_ORDER,
} from '../actions/shop'
const config = require('../config')
const defaultState = config.defaultState.shop

export default function shop(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SHOP:
      return action.shop
    case CHANGE_SHOP_ORDER:
      let nextShop = state.slice()
      let orderToChange = nextShop[action.mainCurrencyId][action.alternateCurrencyId] || {
        overridden: false,
        autotradeEnabled: false,
        type: 'both'
      }
      let changedOrder = Object.assign({}, orderToChange, action.order)
      nextShop[action.mainCurrencyId][action.alternateCurrencyId] = changedOrder
      return nextShop
    default:
      return state
  }
}

