import {
  ADD_FILTER,
  REMOVE_FILTER,
} from '../actions/currencyFilter'
const config = require('../config')
const defaultState = config.defaultState.currencyFilter

export default function currencyFilter(state = defaultState, action) {
  switch(action.type) {
    case ADD_FILTER:
      return [
        ...state.slice(),
        action.category
      ]
      case REMOVE_FILTER:
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

