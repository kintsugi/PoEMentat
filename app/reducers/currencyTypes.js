import {
  CHANGE_CURRENCY_TYPES,
} from '../actions/currencyTypes'
const config = require('../config')
const defaultState = config.defaultState.currencyTypes

export default function currencyTypes(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_CURRENCY_TYPES:
      return Object.assign({}, action.currencyTypes)
    default:
      return state
  }
}

