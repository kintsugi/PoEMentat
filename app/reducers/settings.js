import {
  CHANGE_SETTINGS,
} from '../actions/settings'
import { REHYDRATE } from 'redux-persist/constants'
const config = require('../config')
const devConfig = require('../config.development.json')
const defaultState = process.env.NODE_ENV === 'production' ? config.defaultState.settings : devConfig.defaultState.settings

export default function settings(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_SETTINGS:
      if(action.settings.usernameWhitelist) {
        action.settings.usernameWhitelist = action.settings.usernameWhitelist.map(username => username.trim())
      }
      return Object.assign({}, state, action.settings)
    case REHYDRATE:
      //add in new settings options to existing settings
      let incomingSettings = action.payload.settings
      if(incomingSettings) {
        for(let key in defaultState) {
          if(incomingSettings[key] === undefined) {
            incomingSettings[key] = defaultState[key]
          }
        }
        return incomingSettings
      }
      return state

    default:
      return state
  }
}

