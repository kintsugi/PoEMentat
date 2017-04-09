import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Dropdown,
  Button,
  MenuItem,
} from 'react-bootstrap'
import CurrencyImg from './CurrencyImg'
import styles from './MainCurrencySelectable.css'

export default class MainCurrencySelectable extends Component {

  onSelect(currencyId) {
    document.dispatchEvent(new MouseEvent('click'))
    if(this.props.onSelectMainCurrency) {
      this.props.onSelectMainCurrency(currencyId)
    }
  }

  render() {
    return (
      <MenuItem href="" onSelect={this.onSelect.bind(this)} eventKey={this.props.currencyType.id}>
        <div className={styles.currencyImgContainer}>
          <CurrencyImg id={this.props.currencyType.id} />
        </div>
        {' ' + this.props.currencyType.name}
      </MenuItem>
    )
  }
}

