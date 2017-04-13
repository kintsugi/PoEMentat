import {
  READY_CURRENCY_TYPES,
  READY_INVENTORY,
  READY_MARKET,
} from '../actions/ready'
const config = require('../config')
const defaultState = config.defaultState.inventory

export default function ready(state = defaultState, action) {
  switch(action.type) {
    case READY_CURRENCY_TYPES:
      return Object.assign({}, state, action.state)
    case READY_INVENTORY:
      return Object.assign({}, state, action.state)
    case READY_MARKET:
      return Object.assign({}, state, action.state)
    default:
      return state
  }
}

