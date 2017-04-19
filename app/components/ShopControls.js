import React, { Component } from 'react'
import {
  Col,
  ButtonToolbar,
  ButtonGroup,
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import styles from './ShopControls.css'
import CurrencyImg from './CurrencyImg'

export default class ShopControls extends Component {

  constructor(props) {
    super(props)
    let shop = this.props.selectedShop
    let market = this.props.selectedMarket
    this.state = {
      shop,
      market,
      minBulk: shop.minBulk || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    let shop = nextProps.selectedShop
    let market = nextProps.selectedMarket
    let minBulk = this.state.minBulk

    let curMainCurrency = this.props.selectedCurrencies.main
    let curAlternateCurrency = this.props.selectedCurrencies.alternate
    let nextMainCurrency = nextProps.selectedCurrencies.main
    let nextAlternateCurrency = nextProps.selectedCurrencies.alternate
    if(curMainCurrency != nextMainCurrency || curAlternateCurrency != nextAlternateCurrency) {
      minBulk = shop.minBulk || ''
    }

    this.setState({
      shop,
      market,
      minBulk,
    })
  }

  onAutoTradeButtonPress() {
    let order = {
      autotradeEnabled: !this.state.shop.autotradeEnabled
    }
    this.props.onShopChange(this.props.selectedCurrencies.main, this.props.selectedCurrencies.alternate, order)
  }

  onOrderTypeButtonPress(type) {
    this.props.onShopChange(this.props.selectedCurrencies.main, this.props.selectedCurrencies.alternate, {
      type,
    })
  }

  onMinBulkChange(event) {
    this.setState({
      minBulk: parseInt(event.target.value) || ''
    })
  }

  onMinBulkBlur(event) {
    this.props.onShopChange(this.props.selectedCurrencies.main, this.props.selectedCurrencies.alternate, {
      minBulk: parseInt(event.target.value)
    })
  }

  renderAutotradeButton() {
    let bsStyle, buttonText
    if(this.state.shop.autotradeEnabled) {
      bsStyle = "danger"
      buttonText = "Turn Off Autotrade"
    } else {
      bsStyle = "success"
      buttonText = "Turn On Autotrade"
    }
    return <Button bsStyle={bsStyle} onClick={this.onAutoTradeButtonPress.bind(this)}>{buttonText}</Button>
  }

  render() {
    if(!this.props.selectedCurrencies.main || !this.props.selectedCurrencies.alternate) {
      return (<div />)
    }

    let bothButtonStyle = this.state.shop.type == 'both' ? styles.pressedButton : {}
    let buyButtonStyle = this.state.shop.type == 'buy' ? styles.pressedButton : {}
    let sellButtonStyle = this.state.shop.type == 'sell' ? styles.pressedButton : {}

    return (
      <Col xs={12}>
        <br />
        <Col xs={3}>
          <ButtonToolbar>
            {this.renderAutotradeButton()}
            <ButtonGroup>
              <Button className={bothButtonStyle} onClick={() => {this.onOrderTypeButtonPress('both')}}>Both</Button>
              <Button className={buyButtonStyle} onClick={() => {this.onOrderTypeButtonPress('buy')}}>Buy</Button>
              <Button className={sellButtonStyle} onClick={() => {this.onOrderTypeButtonPress('sell')}}>Sell</Button>
            </ButtonGroup>

          </ButtonToolbar>
        </Col>
        <Col xs={3}>
          <div className={styles.bulkInputContainer}>
            <InputGroup>
              <InputGroup.Addon>
                Min Bulk <CurrencyImg inline={true} id={this.props.selectedCurrencies.main} />
              </InputGroup.Addon>
              <FormControl
                value={this.state.minBulk}
                className={[styles.bulkInput]}
                onChange={this.onMinBulkChange.bind(this)}
                onBlur={this.onMinBulkBlur.bind(this)}
                type="text"
              />
            </InputGroup>
          </div>
          <Col xs={6}>
          </Col>
        </Col>
      </Col>
    )
  }
}

