import {
  CHANGE_INVENTORY,
} from '../actions/inventory'
const config = require('../config')
const defaultState = config.defaultState.inventory

export default function inventory(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_INVENTORY:
      return action.inventory
    default:
      return state
  }
}

