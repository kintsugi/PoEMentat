import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Market from '../components/Market'

class MarketPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMainCurrencyId: 4,
      selectedAlternateCurrencyId: 2,
    }
  }

  onSelectMainCurrency(selectedMainCurrencyId) {
    console.log(selectedMainCurrencyId)
    this.setState({
      selectedMainCurrencyId,
    })
  }

  onSelectAlternateCurrency(selectedAlternateCurrencyId) {
    console.log(selectedAlternateCurrencyId)
    this.setState({
      selectedAlternateCurrencyId,
    })
  }

  render() {
    return (
      <Market
        currencyTypes={this.props.currencyTypes}
        offers={this.props.offers}
        selectedMainCurrencyId={this.state.selectedMainCurrencyId}
        selectedAlternateCurrencyId={this.state.selectedAlternateCurrencyId}
        onSelectMainCurrency={this.onSelectMainCurrency.bind(this)}
        onSelectAlternateCurrency={this.onSelectAlternateCurrency.bind(this)}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    currencyTypes: state.currencyTypes,
    offers: state.offers,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketPage)
