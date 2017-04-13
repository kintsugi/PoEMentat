import {
  ADD_MARKET_FILTER,
  REMOVE_MARKET_FILTER,
} from '../actions/marketCurrencyFilter'
const config = require('../config')
const defaultState = config.defaultState.marketCurrencyFilter

export default function marketCurrencyFilter(state = defaultState, action) {
  switch(action.type) {
    case ADD_MARKET_FILTER:
      return [
        ...state.slice(),
        action.category
      ]
      case REMOVE_MARKET_FILTER:
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

