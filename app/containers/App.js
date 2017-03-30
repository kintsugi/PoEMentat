import React, {  Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from 'react-loading'
import NavigationPage from './NavigationPage'
import CurrencyTypesParser, { currencyTypesList } from '../utils/CurrencyTypesParser'
import Inventory from '../utils/Inventory'
import * as ReadyActions from '../actions/ready'
import * as SettingsActions from '../actions/settings'
import * as CurrencyTypesActions from '../actions/currencyTypes'
import * as InventoryActions from '../actions/inventory'
import styles from './App.css'
const constants = require('../constants')
let log = require('../utils/log')

class App extends Component {
  constructor() {
    super()
    this.state = {
      ready: false,
    }
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

  componentWillReceiveProps(nextProps) {
    let ready = nextProps.ready.currencyTypes && nextProps.ready.inventory
    this.setState({
      ready,
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
    let { readyInventory } = this.props
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
    let { changeInventory } = this.props
    return (this.inventory.inventoryParser.numTabs ?
      this.inventory.update() :
      this.inventory.init(this.currencyTypesParser.getParsedCurrencyTypes()))
      .then((inventory) => {
        changeInventory(inventory)
        return
      })
      .catch((err) => {
        if(err.message == constants.errs.stashThrottle) {
          log.warn('inventory update throttled')
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
    if(this.state.ready) {
      return (
        <NavigationPage history={this.props.history}/>
      )
    } else {
      return (
        <div className={styles.loading}>
          <Loading type='spinningBubbles' color='#333' />
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    ready: state.ready,
    settings: state.settings,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...ReadyActions,
    ...SettingsActions,
    ...CurrencyTypesActions,
    ...InventoryActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
