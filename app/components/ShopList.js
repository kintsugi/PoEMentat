import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Checkbox,
  ButtonGroup,
  DropdownButton,
  Button,
  MenuItem,
  PageHeader,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import CurrencyImg from './CurrencyImg'
import Order from './Order'

export default class ShopList extends Component {

  constructor(props) {
    super(props)
  }

  checkFilter(currencyType) {
    return this.props.currencyFilter.indexOf(currencyType.category) != -1
  }

  render() {
    if(!this.props.selectedCurrencies.main) {
      return (<div />)
    }

    let mainCurrencyShop = this.props.shop[this.props.selectedCurrencies.main] || []
    let mainCurrencyMarket = this.props.markets[this.props.selectedCurrencies.main]

    let filteredCurrencyTypes = this.props.currencyTypes.list.filter((currencyType) => {
      return this.checkFilter(currencyType) && currencyType.id != this.props.selectedCurrencies.main
    })

    let orders = filteredCurrencyTypes.map((currencyType) => (
      <Order
        key={currencyType.name}
        market={mainCurrencyMarket[currencyType.id]}
        order={mainCurrencyShop[currencyType.id] || {
          overridden: false,
          autotradeEnabled: false,
          type: 'both'
        }}
        onShopChange={this.props.onShopChange}
        selectedCurrencies={this.props.selectedCurrencies}
        currencyType={currencyType}
      />
    ))


    return (
      <Col xs={12}>
        {orders}
      </Col>
    )
  }
}

