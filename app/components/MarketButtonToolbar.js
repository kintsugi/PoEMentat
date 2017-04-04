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

const quickSelections = [4, 6]

export default class MarketButtonToolbar extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ButtonToolbar>
        <MainCurrencyDropdown
          selectedMainCurrencyId={this.props.selectedMainCurrencyId}
          onSelectMainCurrency={this.props.onSelectMainCurrency}
          quickSelections={quickSelections}
          currencyTypes={this.props.currencyTypes}
        />
      </ButtonToolbar>
    )
  }
}

