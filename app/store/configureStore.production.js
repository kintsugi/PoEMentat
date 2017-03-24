import { createStore, applyMiddleware } from 'redux'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import type { counterStateType } from '../reducers/counter'

const router = routerMiddleware(hashHistory)

const enhancer = applyMiddleware(thunk, router)
const persistEnhancer = compose(
  applyMiddleware(thunk, router),
  autoRehydrate()
)

export default function configureStore() {
  return createStore(rootReducer, undefined, enhancer) // eslint-disable-line
}
