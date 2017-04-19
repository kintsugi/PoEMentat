import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  DropdownButton,
  Button,
  MenuItem,
} from 'react-bootstrap'
import MainCurrencyDropdown from './MainCurrencyDropdown'
import CurrencyFilter from './CurrencyFilter'
import ShopSettingsToolbar from './ShopSettingsToolbar'
import styles from './MarketButtonToolbar.css'

const quickSelections = [4, 6]

export default class MarketButtonToolbar extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <ButtonToolbar className={styles.container}>
          <MainCurrencyDropdown
            selectedCurrencies={this.props.selectedCurrencies}
            onSelectMainCurrency={this.props.onSelectMainCurrency}
            quickSelections={quickSelections}
            currencyTypes={this.props.currencyTypes}
          />
        </ButtonToolbar>
        <CurrencyFilter
          currencyFilter={this.props.currencyFilter}
          onCurrencyFilterChange={this.props.onCurrencyFilterChange}
        />
        <ShopSettingsToolbar
          settings={this.props.settings}
          onShopSettingsChange={this.props.onShopSettingsChange}
        />
      </div>
    )
  }
}

