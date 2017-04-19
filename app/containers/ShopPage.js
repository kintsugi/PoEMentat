import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Shop from '../components/Shop'
import * as ShopActions from '../actions/shop'
import * as ShopCurrencyFilterActions from '../actions/shopCurrencyFilter'
import * as SelectedShopCurrenciesActions from '../actions/selectedShopCurrencies.js'
import * as SettingsActions from '../actions/settings'

class ShopPage extends Component {
  constructor(props) {
    super(props)
  }

  onSelectMainCurrency(selectedMainCurrencyId) {
    let { changeSelectedMainShopCurrency } = this.props
    changeSelectedMainShopCurrency(selectedMainCurrencyId)
  }

  onCurrencyFilterChange(category) {
    let { changeShopFilter } = this.props
    changeShopFilter(category)
  }

  onShopChange(mainCurrencyId, alternateCurrencyId, order) {
    let  { changeShopOrder } = this.props
    order.mainCurrencyType = this.props.currencyTypes.idDict[mainCurrencyId]
    order.alternateCurrencyType = this.props.currencyTypes.idDict[alternateCurrencyId],
    changeShopOrder(mainCurrencyId, alternateCurrencyId, order)
  }

  onShopSettingsChange(nextSettings) {
    let { changeSettings } = this.props
    changeSettings(nextSettings)
  }

  render() {
    let selectedCurrencies = this.props.selectedShopCurrencies
    let selectedMarket = {}, selectedShop = {}
    if(this.props.markets[selectedCurrencies.main] && this.props.markets[selectedCurrencies.main][selectedCurrencies.alternate]) {
      selectedMarket = this.props.markets[selectedCurrencies.main][selectedCurrencies.alternate]
    }
    if(this.props.shop[selectedCurrencies.main] && this.props.shop[selectedCurrencies.main][selectedCurrencies.alternate]) {
      selectedShop = this.props.shop[selectedCurrencies.main][selectedCurrencies.alternate]
    }
    return (
      <Shop
        settings={this.props.settings}
        selectedMarket={selectedMarket}
        selectedShop={selectedShop}
        settings={this.props.settings}
        shop={this.props.shop}
        markets={this.props.markets}
        selectedCurrencies={this.props.selectedShopCurrencies}
        onSelectMainCurrency={this.onSelectMainCurrency.bind(this)}
        onCurrencyFilterChange={this.onCurrencyFilterChange.bind(this)}
        onShopChange={this.onShopChange.bind(this)}
        currencyFilter={this.props.shopCurrencyFilter}
        currencyTypes={this.props.currencyTypes}
        onShopSettingsChange={this.onShopSettingsChange.bind(this)}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    currencyTypes: state.currencyTypes,
    shopCurrencyFilter: state.shopCurrencyFilter,
    selectedShopCurrencies: state.selectedShopCurrencies,
    shop: state.shop,
    markets: state.markets,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...ShopActions,
    ...ShopCurrencyFilterActions,
    ...SelectedShopCurrenciesActions,
    ...SettingsActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage)
