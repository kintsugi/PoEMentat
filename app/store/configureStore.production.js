import { createStore, applyMiddleware, compose } from 'redux'
import { autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import config from '../config'

const router = routerMiddleware(hashHistory)

const enhancer = compose(applyMiddleware(thunk, router))

const persistEnhancer = compose(applyMiddleware(thunk, router), autoRehydrate())

export default function configureStore() {
  const store = config.persistStore ? createStore(rootReducer, undefined, persistEnhancer) : createStore(rootReducer, undefined, enhancer)
  return store
}
