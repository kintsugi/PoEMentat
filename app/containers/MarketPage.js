import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Market from '../components/Market'
import * as ShopActions from '../actions/shop'
import * as MarketCurrencyFilterActions from '../actions/marketCurrencyFilter'
import * as SelectedMarketCurrenciesActions from '../actions/selectedMarketCurrencies'
import * as SettingsActions from '../actions/settings'

class MarketPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMainCurrencyId: 4,
      selectedAlternateCurrencyId: null,
    }
  }

  onSelectMainCurrency(selectedMainCurrencyId) {
    let { changeSelectedMainMarketCurrency } = this.props
    changeSelectedMainMarketCurrency(selectedMainCurrencyId)
  }

  onSelectAlternateCurrency(selectedAlternateCurrencyId) {
    let { changeSelectedAlternateMarketCurrency } = this.props
    changeSelectedAlternateMarketCurrency(selectedAlternateCurrencyId)
  }

  onCurrencyFilterChange(category) {
    let { changeMarketFilter } = this.props
    changeMarketFilter(category)
  }

  onShopChange(mainCurrencyId, alternateCurrencyId, order) {
    let { changeShopOrder } = this.props
    order.mainCurrencyType = this.props.currencyTypes.idDict[mainCurrencyId]
    order.alternateCurrencyType = this.props.currencyTypes.idDict[alternateCurrencyId],
    changeShopOrder(mainCurrencyId, alternateCurrencyId, order)
  }

  onShopSettingsChange(nextSettings) {
    let { changeSettings } = this.props
    changeSettings(nextSettings)
  }

  render() {
    let selectedCurrencies = this.props.selectedMarketCurrencies
    let selectedMarket = {}, selectedShop = {
      overridden: false,
      autotradeEnabled: false,
      type: 'both'
    }
    if(this.props.markets[selectedCurrencies.main] && this.props.markets[selectedCurrencies.main][selectedCurrencies.alternate]) {
      selectedMarket = this.props.markets[selectedCurrencies.main][selectedCurrencies.alternate]
    }
    if(this.props.shop[selectedCurrencies.main] && this.props.shop[selectedCurrencies.main][selectedCurrencies.alternate]) {
      selectedShop = this.props.shop[selectedCurrencies.main][selectedCurrencies.alternate]
    }
    return (
      <Market
        settings={this.props.settings}
        currencyTypes={this.props.currencyTypes}
        offers={this.props.offers}
        shop={this.props.shop}
        markets={this.props.markets}
        selectedMarket={selectedMarket}
        selectedShop={selectedShop}
        currencyFilter={this.props.marketCurrencyFilter}
        selectedCurrencies={this.props.selectedMarketCurrencies}
        onSelectMainCurrency={this.onSelectMainCurrency.bind(this)}
        onSelectAlternateCurrency={this.onSelectAlternateCurrency.bind(this)}
        onCurrencyFilterChange={this.onCurrencyFilterChange.bind(this)}
        onShopChange={this.onShopChange.bind(this)}
        onShopSettingsChange={this.onShopSettingsChange.bind(this)}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    currencyTypes: state.currencyTypes,
    offers: state.offers,
    markets: state.markets,
    shop: state.shop,
    marketCurrencyFilter: state.marketCurrencyFilter,
    selectedMarketCurrencies: state.selectedMarketCurrencies,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...ShopActions,
    ...MarketCurrencyFilterActions,
    ...SelectedMarketCurrenciesActions,
    ...SettingsActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketPage)
