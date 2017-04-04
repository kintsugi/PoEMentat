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
              selectedMainCurrencyId={this.props.selectedMainCurrencyId}
              onSelectMainCurrency={this.props.onSelectMainCurrency}
              currencyTypes={this.props.currencyTypes}
            />
          </Col>
          <Col xs={12}>
            <br />
            <AlternateCurrencyButtonList
              selectedAlternateCurrencyId={this.props.selectedAlternateCurrencyId}
              onSelectAlternateCurrency={this.props.onSelectAlternateCurrency}
              currencyTypes={this.props.currencyTypes}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

