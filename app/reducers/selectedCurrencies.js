import {
  CHANGE_SELECTED_CURRENCIES,
} from '../actions/selectedCurrencies'
const config = require('../config')
const defaultState = config.defaultState.selectedCurrencies

export default function selectedCurrencies(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SELECTED_CURRENCIES:
      return Object.assign({}, action.selections)
    default:
      return state
  }
}

