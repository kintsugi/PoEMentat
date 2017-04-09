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
import MarketButtonToolbar from './MarketButtonToolbar'
import AlternateCurrencyButtonList from './AlternateCurrencyButtonList'
import OffersList from './OffersList'

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
              currencyFilter={this.props.currencyFilter}
              selectedCurrencies={this.props.selectedCurrencies}
              onSelectAlternateCurrency={this.props.onSelectAlternateCurrency}
              currencyTypes={this.props.currencyTypes}
            />
          </Col>
          <OffersList
            currencyTypes={this.props.currencyTypes}
            offers={this.props.offers}
            selectedCurrencies={this.props.selectedCurrencies}
            selectedAlternateCurrencyId={this.props.selectedAlternateCurrencyId}
          />
        </Row>
      </Grid>
    )
  }
}

