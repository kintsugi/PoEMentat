import React, {  Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from 'react-loading'
import NavigationPage from './NavigationPage'
import CurrencyTypesParser, { currencyTypesList } from '../utils/CurrencyTypesParser'
import Market from '../utils/Market'
import Inventory from '../utils/Inventory'
import Shop from '../utils/Shop'
import * as ReadyActions from '../actions/ready'
import * as SettingsActions from '../actions/settings'
import * as CurrencyTypesActions from '../actions/currencyTypes'
import * as InventoryActions from '../actions/inventory'
import * as OffersActions from '../actions/offers'
import * as MarketsActions from '../actions/markets'
import * as ShopActions from '../actions/shop'
import styles from './App.css'
let io = require('socket.io-client')
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
    let { changeOffers, changeMarkets, readyMarket, changeShop } = this.props
    this.initializeCurrencyTypes()
      .then(() => {
        this.shop = new Shop(this.props.settings, this.currencyTypesParser.getParsedCurrencyTypes())
        if(!this.props.shop.length) {
          changeShop(this.shop.init())
        }
        this.market = new Market(io, this.currencyTypesParser.getParsedCurrencyTypes(), (offers, markets) => {
          changeOffers(offers)
          changeMarkets(markets)
          if(!this.props.ready.market) {
            readyMarket()
          }
        })
        return this.initializeInventory()
      })
      .catch((err) => {
        throw err
      })
  }

  componentWillReceiveProps(nextProps) {
    let ready = nextProps.ready.currencyTypes && nextProps.ready.inventory && nextProps.ready.market
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
        return this.shopInterval()
      })
      .catch((err) => {
        throw err
      })
  }


  inventoryInterval() {
    let { changeInventory } = this.props
    return (this.inventory.inventoryParser.numTabs ?
      this.inventory.update(this.props.settings) :
      this.inventory.init(this.props.settings, this.currencyTypesParser.getParsedCurrencyTypes()))
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

  shopInterval() {
    let { changeShop } = this.props
    return this.shop.postShop(this.props.settings, this.props.shop, this.props.markets)
      .then((postedShop) => {
        return changeShop(postedShop)
      })
      .catch((err) => {
        throw err
      })
      .then(() => {
        this.shopIntervalID = setTimeout(() => {
          this.shopInterval()
        }, this.props.settings.updateIntervals.shop)
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
    markets: state.markets,
    shop: state.shop,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...ReadyActions,
    ...SettingsActions,
    ...CurrencyTypesActions,
    ...InventoryActions,
    ...OffersActions,
    ...MarketsActions,
    ...ShopActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
