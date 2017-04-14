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
import AlternateCurrencyButtonList from './AlternateCurrencyButtonList'
import MarketDetails from './MarketDetails'
import OffersList from './OffersList'
import ShopControls from './ShopControls'
import MarketHeader from './MarketHeader'

export default class Market extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} >
            <br />
            <MarketButtonToolbar
              selectedCurrencies={this.props.selectedCurrencies}
              onSelectMainCurrency={this.props.onSelectMainCurrency}
              currencyFilter={this.props.currencyFilter}
              currencyTypes={this.props.currencyTypes}
              onCurrencyFilterChange={this.props.onCurrencyFilterChange}
            />
          </Col>
          <Col xs={12}>
            <br />
            <AlternateCurrencyButtonList
              markets={this.props.markets}
              currencyFilter={this.props.currencyFilter}
              selectedCurrencies={this.props.selectedCurrencies}
              onSelectAlternateCurrency={this.props.onSelectAlternateCurrency}
              currencyTypes={this.props.currencyTypes}
            />
          </Col>
          <MarketHeader
            markets={this.props.markets}
            selectedCurrencies={this.props.selectedCurrencies}
          />
          <ShopControls
            markets={this.props.markets}
            shop={this.props.shop}
            selectedShop={this.props.selectedShop}
            selectedCurrencies={this.props.selectedCurrencies}
            onShopChange={this.props.onShopChange}
          />
          <MarketDetails
            markets={this.props.markets}
            selectedCurrencies={this.props.selectedCurrencies}
          />
          <OffersList
            settings={this.props.settings}
            currencyTypes={this.props.currencyTypes}
            offers={this.props.offers}
            markets={this.props.markets}
            selectedCurrencies={this.props.selectedCurrencies}
          />
        </Row>
      </Grid>
    )
  }
}

