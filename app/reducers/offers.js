import {
  CHANGE_OFFERS,
} from '../actions/offers'
const config = require('../config')
const defaultState = config.defaultState.offers

export default function offers(state = defaultState, action) {
  switch(action.type) {
    case CHANGE_OFFERS:
      return action.offers
    default:
      return state
  }
}

