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
      market
    }
  }

  componentWillReceiveProps(nextProps) {
    let shop = nextProps.selectedShop
    let market = nextProps.selectedMarket
    this.setState({
      shop,
      market
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
          <br />
        </Col>
        <Col xs={3}>
          <div className={styles.bulkInputContainer}>
            <InputGroup>
              <InputGroup.Addon>
                Min Bulk <CurrencyImg inline={true} id={this.props.selectedCurrencies.main} />
              </InputGroup.Addon>
              <FormControl
                defaultValue={this.state.shop.minBulk}
                className={[styles.bulkInput]}
                onBlur={this.onMinBulkChange.bind(this)}
                type="text"
              />
            </InputGroup>
          </div>
          <br />
          <Col xs={6}>
            <br />
          </Col>
        </Col>
      </Col>
    )
  }
}

