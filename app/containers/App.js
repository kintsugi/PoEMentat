import React, {  Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavigationPage from './NavigationPage'
import CurrencyTypesParser, { currencyTypesList } from '../utils/CurrencyTypesParser'
import Inventory from '../utils/Inventory'
import * as SettingsActions from '../actions/settings'
import * as CurrencyTypesActions from '../actions/currencyTypes'
import * as ReadyActions from '../actions/ready'
const constants = require('../constants')

class App extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    this.initializeCurrencyTypes()
      .then(() => {
        return this.initializeInventory()
      })
      .catch((err) => {
        throw err
      })
  }


  initializeCurrencyTypes() {
    let {
      changeCurrencyTypes,
      readyCurrencyTypes
    } = this.props
    this.currencyTypesParser = new CurrencyTypesParser()
    return this.currencyTypesParser.getCurrencyTypes()
      .then((currencyTypes) => {
        changeCurrencyTypes(currencyTypes)
        readyCurrencyTypes()
        return
      })
      .catch((err) => {
        throw err
      })
  }

  initializeInventory() {
    let {
      readyInventory
    } = this.props
    this.inventory = new Inventory(this.props.settings)
    return this.inventoryInterval()
      .then(() => {
        readyInventory()
        return
      })
      .catch((err) => {
        throw err
      })
  }

  inventoryInterval() {
    return (this.inventory.inventoryParser.numTabs ?
      this.inventory.update() :
      this.inventory.init(this.currencyTypesParser.getParsedCurrencyTypes()))
      .then((data) => {
        console.log(data)
        return
      })
      .catch((err) => {
        if(err.message == constants.errs.stashThrottle) {
          console.log('inventory update throttled')
        } else {
          throw err
        }
      })
      .then(() => {
        this.inventoryIntervalId = setTimeout(() => {
          this.inventoryInterval()
        }, this.props.settings.updateIntervals.stash)
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
  return bindActionCreators({
    ...SettingsActions,
    ...CurrencyTypesActions,
    ...ReadyActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
