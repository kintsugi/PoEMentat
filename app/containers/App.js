import React, {  Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavigationPage from './NavigationPage'
import InventoryParser from '../utils/InventoryParser'
import CurrencyTypesParser, { currencyTypesList } from '../utils/CurrencyTypesParser'
import * as SettingsActions from '../actions/settings'

class App extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    this.inventoryParser = new InventoryParser(this.props.settings)
    this.inventoryParser.init()
      .then(() => {
        console.log('InventoryParser Initialized')
        return
      })
      .catch((err) => {
        throw err
      })
    this.currencyTypesParser = new CurrencyTypesParser()
    this.currencyTypesParser.getTypes()
      .then((data) => {
        console.log(currencyTypesList)
        return
      })
      .catch((err) => {
        throw err
      })

  }

  render() {
    return (
      <NavigationPage history={this.props.history}/>
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
