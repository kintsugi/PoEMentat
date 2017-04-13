import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  DropdownButton,
  Button,
  PageHeader,
  MenuItem,
} from 'react-bootstrap'
import MarketButtonToolbar from './MarketButtonToolbar'
import ShopList from './ShopList'

export default class Shop extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12}>
          <br />
          <MarketButtonToolbar
            selectedCurrencies={this.props.selectedCurrencies}
            onSelectMainCurrency={this.props.onSelectMainCurrency}
            currencyFilter={this.props.currencyFilter}
            currencyTypes={this.props.currencyTypes}
            onCurrencyFilterChange={this.props.onCurrencyFilterChange}
          />
          <br />
          </Col>
          <ShopList
            shop={this.props.shop}
            markets={this.props.markets}
            selectedCurrencies={this.props.selectedCurrencies}
            onShopChange={this.props.onShopChange}
            currencyFilter={this.props.currencyFilter}
            currencyTypes={this.props.currencyTypes}
          />
        </Row>
      </Grid>
    )
  }
}
