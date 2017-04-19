import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  DropdownButton,
  Button,
  MenuItem,
} from 'react-bootstrap'
import styles from './ShopSettingsToolbar.css'


export default class ShopSettingsToolbar extends Component {

  constructor(props) {
    super(props)
  }

  onOnButtonPress() {
    this.props.onShopSettingsChange({shopEnabled: true})
  }

  onOffButtonPress() {
    this.props.onShopSettingsChange({shopEnabled: false})
  }

  onGlobalOrderTypeButtonPress(globalOrderType) {
    this.props.onShopSettingsChange({globalOrderType})
  }

  render() {
    let onButtonBsStyle = this.props.settings.shopEnabled ? {bsStyle:'success'} : null
    let offButtonBsStyle = !this.props.settings.shopEnabled ? {bsStyle:'danger'} : null

    let noneButtonStyle = this.props.settings.globalOrderType == 'none' ? styles.pressedButton : {}
    let bothButtonStyle = this.props.settings.globalOrderType == 'both' ? styles.pressedButton : {}
    let buyButtonStyle = this.props.settings.globalOrderType == 'buy' ? styles.pressedButton : {}
    let sellButtonStyle = this.props.settings.globalOrderType == 'sell' ? styles.pressedButton : {}
    return (
      <div style={{paddingTop: '4px'}}>
        <ButtonToolbar>
          <ButtonGroup>
            <Button {...onButtonBsStyle} onClick={this.onOnButtonPress.bind(this)}>On</Button>
            <Button {...offButtonBsStyle} onClick={this.onOffButtonPress.bind(this)}>Off</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button className={noneButtonStyle} onClick={() => this.onGlobalOrderTypeButtonPress('none')}>None</Button>
            <Button className={bothButtonStyle} onClick={() => this.onGlobalOrderTypeButtonPress('both')}>All Both</Button>
            <Button className={buyButtonStyle} onClick={() => this.onGlobalOrderTypeButtonPress('buy')}>All Buy</Button>
            <Button className={sellButtonStyle} onClick={() => this.onGlobalOrderTypeButtonPress('sell')}>All Sell</Button>
          </ButtonGroup>

        </ButtonToolbar>
      </div>
    )
  }
}

