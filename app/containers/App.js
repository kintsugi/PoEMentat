import React, {  Component } from 'react'
import NavigationPage from './NavigationPage'

export default class App extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <NavigationPage history={this.props.history}/>
    )
  }
}
