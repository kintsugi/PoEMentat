import {
  CHANGE_SETTINGS,
} from '../actions/settings'
let config = require('../config')
let defaultState = config.defaultState.settings

export default function settings(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SETTINGS:
      return Object.assign({}, action.settings)
    default:
      return state
  }
}

