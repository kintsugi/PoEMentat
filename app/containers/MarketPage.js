import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Market from '../components/Market'
import * as CurrencyFilterActions from '../actions/currencyFilter'
import * as SelectedCurrenciesActions from '../actions/selectedCurrencies'

class MarketPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMainCurrencyId: 4,
      selectedAlternateCurrencyId: null,
    }
  }

  onSelectMainCurrency(selectedMainCurrencyId) {
    let { changeSelectedMainCurrency } = this.props
    changeSelectedMainCurrency(selectedMainCurrencyId)
  }

  onSelectAlternateCurrency(selectedAlternateCurrencyId) {
    let { changeSelectedAlternateCurrency } = this.props
    changeSelectedAlternateCurrency(selectedAlternateCurrencyId)
  }

  onCurrencyFilterChange(category) {
    let { changeFilter } = this.props
    changeFilter(category)
  }

  render() {
    return (
      <Market
        currencyTypes={this.props.currencyTypes}
        offers={this.props.offers}
        currencyFilter={this.props.currencyFilter}
        selectedCurrencies={this.props.selectedCurrencies}
        onSelectMainCurrency={this.onSelectMainCurrency.bind(this)}
        onSelectAlternateCurrency={this.onSelectAlternateCurrency.bind(this)}
        onCurrencyFilterChange={this.onCurrencyFilterChange.bind(this)}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    currencyTypes: state.currencyTypes,
    offers: state.offers,
    currencyFilter: state.currencyFilter,
    selectedCurrencies: state.selectedCurrencies,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...CurrencyFilterActions,
    ...SelectedCurrenciesActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketPage)
