import {
  CHANGE_MARKETS,
} from '../actions/markets'
const config = require('../config')
const defaultState = config.defaultState.markets

export default function markets(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_MARKETS:
      return action.markets
    default:
      return state
  }
}

