import {
  CHANGE_SETTINGS,
} from '../actions/settings'
const config = require('../config')
const devConfig = require('../config.development.json')
const defaultState = process.env.NODE_ENV === 'production' ? config.defaultState.settings : devConfig.defaultState.settings

export default function settings(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SETTINGS:
      action.settings.usernameWhitelist = action.settings.usernameWhitelist.map(username => username.trim())
      return Object.assign({}, state, action.settings)
    default:
      return state
  }
}

