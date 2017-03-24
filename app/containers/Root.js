import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
//import {persistStore} from 'redux-persist'
import App from './App'

export default class Root extends Component {

  constructor() {
    super()
    this.state = { rehydrated: true }
  }

  componentWillMount(){
    //persistStore(this.props.store, {blacklist: ['routes']}, () => {
      //this.setState({ rehydrated: true })
    //})
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
