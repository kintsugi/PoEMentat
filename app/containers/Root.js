import React, { Component, PropTypes } from 'react'
import { AsyncNodeStorage } from 'redux-persist-node-storage'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { persistStore } from 'redux-persist'
import { LocalStorage } from 'node-localstorage'
import { remote } from 'electron'
import path from 'path'
import App from './App'
const config = require('../config')
const constants = require('../constants')

export default class Root extends Component {

  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount(){
    if(config.persistStore) {
      let statePath = constants.paths.data.state
      if (process.env.NODE_ENV === 'production') {
        statePath = path.join(remote.app.getPath('appData'), '/PoEMentat/')
      }
      let storage = new AsyncNodeStorage(statePath)
      persistStore(this.props.store, {
        storage: storage,
        whitelist: ['settings', 'shop']
      }, () => {
        this.setState({ rehydrated: true })
      })
    } else {
      this.setState({ rehydrated: true })
    }
  }

  render() {
    if(!this.state.rehydrated){
      return <div>Loading...</div>
    }
    return (
      <Provider store={this.props.store}>
        <App history={this.props.history}/>
      </Provider>
    )
  }
}
