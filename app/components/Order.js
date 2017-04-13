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
import styles from './Order.css'

export default class Order extends Component {

  constructor(props) {
    super(props)
    this.state = {
      alternateBuyValue: null,
      mainBuyValue: null,
      alternateSellValue: null,
      mainSellValue: null,
    }
  }

  onOverrideChange() {
    this.props.onShopChange(this.props.selectedCurrencies.main, this.props.currencyType.id, {
      overridden: !this.props.order.overridden
    })
  }

  onValueChange(values) {
    let nextState = Object.assign({}, this.state, values)
    this.setState(nextState)
    this.props.onShopChange(this.props.selectedCurrencies.main, this.props.currencyType.id, {
      overriddenOrder: {
        buyOffer: {
          buy_value: nextState.alternateBuyValue,
          sell_value: nextState.mainBuyValue
        },
        sellOffer: {
          buy_value: nextState.mainSellValue,
          sell_value: nextState.alternateSellValue
        }
      }
    })
  }

  render() {
    let alternateBuyValue, mainBuyValue, alternateSellValue, mainSellValue, buyOffer, sellOffer
    if(this.props.order.postedOrder) {
      let postedOrder = this.props.order.postedOrder || {}
      buyOffer = postedOrder.buyOffer || {}
      sellOffer = postedOrder.sellOffer || {}
    } else if(this.props.order.overridden) {
      let overriddenOrder = this.props.order.overriddenOrder || {}
      buyOffer = overriddenOrder.buyOffer || {}
      sellOffer = overriddenOrder.sellOffer || {}
    } else {
      buyOffer = this.props.market.bestOfferDetails.buyOffer || {}
      sellOffer = this.props.market.bestOfferDetails.sellOffer || {}
    }

    if(this.props.order.autotradeEnabled || this.props.order.overridden) {
      alternateBuyValue = buyOffer.buy_value || ''
      mainBuyValue = buyOffer.sell_value || ''
      alternateSellValue = sellOffer.sell_value || ''
      mainSellValue = sellOffer.buy_value || ''
    }
    return (
      <Col xs={12} className={[styles.orderBorder, styles.orderContainer]}>
        <Col xs={2}>
          <Checkbox
            checked={this.props.order.overridden}
            onChange={this.onOverrideChange.bind(this)}
          >
            Override
          </Checkbox>
        </Col>
        <Col xs={5}>
          <InputGroup>
            <InputGroup.Addon>
              buy
            </InputGroup.Addon>
            <FormControl
              defaultValue={alternateBuyValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputLeft]}
              onBlur={(event) => {this.onValueChange({alternateBuyValue: event.target.value})}}
              type="text"
            />
            <InputGroup.Addon>
              <CurrencyImg inline={true} currencyType={this.props.currencyType} /> for
            </InputGroup.Addon>
            <FormControl
              defaultValue={mainBuyValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputRight]}
              onBlur={(event) => {this.onValueChange({mainBuyValue: event.target.value})}}
              type="text"
            />
            <InputGroup.Addon>
              <CurrencyImg id={this.props.selectedCurrencies.main} inline={true} />
            </InputGroup.Addon>
          </InputGroup>
        </Col>
        <Col xs={5}>
          <InputGroup>
            <InputGroup.Addon>
              sell
            </InputGroup.Addon>
            <FormControl
              defaultValue={alternateSellValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputLeft]}
              onBlur={(event) => {this.onValueChange({alternateSellValue: event.target.value})}}
              type="text"
            />
            <InputGroup.Addon>
              <CurrencyImg inline={true} currencyType={this.props.currencyType} /> for
            </InputGroup.Addon>
            <FormControl
              defaultValue={mainSellValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputRight]}
              onBlur={(event) => {this.onValueChange({mainSellValue: event.target.value})}}
              type="text"
            />
            <InputGroup.Addon>
              <CurrencyImg id={this.props.selectedCurrencies.main} inline={true} />
            </InputGroup.Addon>
          </InputGroup>

        </Col>
        <br />
      </Col>
    )
  }
}
