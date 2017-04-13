import {
  ADD_SHOP_FILTER,
  REMOVE_SHOP_FILTER,
} from '../actions/shopCurrencyFilter'
const config = require('../config')
const defaultState = config.defaultState.shopCurrencyFilter

export default function shopCurrencyFilter(state = defaultState, action) {
  switch(action.type) {
    case ADD_SHOP_FILTER:
      return [
        ...state.slice(),
        action.category
      ]
      case REMOVE_SHOP_FILTER:
        let index = state.indexOf(action.category)
        if(index == -1) {
          return state
        }
        let nextState = state.slice()
        nextState.splice(index, 1)
        return nextState
    default:
      return state
  }
}

