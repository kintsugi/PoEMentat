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

    let defaultValues = this.getValues()

    this.state = {
      overriddenAlternateBuyValue: defaultValues.alternateBuyValue,
      overriddenMainBuyValue: defaultValues.mainBuyValue,
      overriddenAlternateSellValue: defaultValues.alternateSellValue,
      overriddenMainSellValue: defaultValues.mainSellValue,
      ...defaultValues
    }
  }

  componentWillReceiveProps(nextProps) {
    let defaultValues = this.getValues(nextProps), nextState = {}
    if(!nextProps.order.overridden) {
      nextState = {
        overriddenAlternateBuyValue: defaultValues.alternateBuyValue,
        overriddenMainBuyValue: defaultValues.mainBuyValue,
        overriddenAlternateSellValue: defaultValues.alternateSellValue,
        overriddenMainSellValue: defaultValues.mainSellValue,
        ...defaultValues
      }
    } else {
      nextState = defaultValues
    }
    this.setState(nextState)
  }

  getValues(nextProps = this.props) {
    let alternateBuyValue, mainBuyValue, alternateSellValue, mainSellValue, buyOffer, sellOffer
    if(nextProps.order.postedOrder) {
      let postedOrder = nextProps.order.postedOrder || {}
      buyOffer = postedOrder.buyOffer || {}
      sellOffer = postedOrder.sellOffer || {}
    } else if(nextProps.order.overridden) {
      let overriddenOrder = nextProps.order.overriddenOrder || {}
      buyOffer = overriddenOrder.buyOffer || {}
      sellOffer = overriddenOrder.sellOffer || {}
    } else if(nextProps.market) {
      buyOffer = nextProps.market.bestOfferDetails.buyOffer || {}
      sellOffer = nextProps.market.bestOfferDetails.sellOffer || {}
    } else {
      buyOffer = {}
      sellOffer = {}
    }

    if(this.props.order.autotradeEnabled || this.props.order.overridden) {
      alternateBuyValue = buyOffer.buy_value || ''
      mainBuyValue = buyOffer.sell_value || ''
      alternateSellValue = sellOffer.sell_value || ''
      mainSellValue = sellOffer.buy_value || ''
    }
    return  {
      alternateBuyValue,
      mainBuyValue,
      alternateSellValue,
      mainSellValue
    }
  }

  onTextChange(values) {
    console.log(values)
    let nextState = Object.assign({}, this.state, values)
    this.setState(nextState)
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
    let defaultValues = this.getValues()
    let { alternateBuyValue, mainBuyValue, alternateSellValue, mainSellValue } = defaultValues
    if(this.props.currencyType.fullName == 'Orb of Alteration') {
      console.log(defaultValues, this.state)
    }
    if(this.props.order.overridden) {
      alternateBuyValue = this.state.overriddenAlternateBuyValue ? this.state.overriddenAlternateBuyValue : defaultValues.alternateBuyValue
      mainBuyValue = this.state.overriddenMainBuyValue ? this.state.overriddenMainBuyValue : defaultValues.mainBuyValue
      alternateSellValue = this.state.overriddenAlternateSellValue ? this.state.overriddenAlternateSellValue : defaultValues.alternateSellValue
      mainSellValue = this.state.overriddenMainSellValue ? this.state.overriddenMainSellValue : defaultValues.mainSellValue
    }
    if(this.props.currencyType.fullName == 'Orb of Alteration') {
      console.log({ alternateBuyValue, mainBuyValue, alternateSellValue, mainSellValue })
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
              value={alternateBuyValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputLeft]}
              onChange={(event) => {this.onTextChange({overriddenAlternateBuyValue: event.target.value})}}
              onBlur={(event) => {this.onValueChange({alternateBuyValue: event.target.value})}}
              type="text"
            />
            <InputGroup.Addon>
              <CurrencyImg inline={true} currencyType={this.props.currencyType} /> for
            </InputGroup.Addon>
            <FormControl
              value={mainBuyValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputRight]}
              onChange={(event) => {this.onTextChange({overriddenMainBuyValue: event.target.value})}}
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
              value={alternateSellValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputLeft]}
              onChange={(event) => {this.onTextChange({overriddenAlternateSellValue: event.target.value})}}
              onBlur={(event) => {this.onValueChange({alternateSellValue: event.target.value})}}
              type="text"
            />
            <InputGroup.Addon>
              <CurrencyImg inline={true} currencyType={this.props.currencyType} /> for
            </InputGroup.Addon>
            <FormControl
              value={mainSellValue}
              disabled={!this.props.order.overridden}
              className={[styles.orderInput, styles.orderInputRight]}
              onChange={(event) => {this.onTextChange({overriddenMainSellValue: event.target.value})}}
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
