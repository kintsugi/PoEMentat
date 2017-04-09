import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  Button,
  ButtonGroup,
  MenuItem,
} from 'react-bootstrap'
import styles from './AlternateCurrencyButtonList.css'
import CurrencyImg from './CurrencyImg'
import { getItemCategory } from '../utils/functions'
const constants = require('../constants')
let textCurrencies = constants.misc.textCurrencyTypes

export default class AlternateCurrencyButtonList extends Component {

  constructor(props) {
    super(props)
  }

  checkFilter(currencyType) {
    return this.props.currencyFilter.indexOf(currencyType.category) != -1
  }

  renderCurrencyButtons(currencyTypes) {
    let currencyButtons = currencyTypes.map((currencyType) => {
      let show = this.checkFilter(currencyType)
      return  (
        <Button
          style={Object.assign({verticalAlign: 'middle'}, show ? {} : {display: 'none'})}
          onClick={() => {
            this.props.onSelectAlternateCurrency(currencyType.id)
          }}
          className={styles.currencyBtn}
          key={currencyType.id}>
          <CurrencyImg currencyType={currencyType} />
        </Button>
      )
    })
    return (
      currencyButtons
    )
  }

  render() {
    let textCurrencyTypes = this.props.currencyTypes.list.filter((currencyType) => {
      return textCurrencies.indexOf(currencyType.category) != -1
    })
    let imageCurrencyTypes = this.props.currencyTypes.list.filter((currencyType) => {
      return textCurrencies.indexOf(currencyType.category) == -1
    })

    return (
      <div>
        <ButtonGroup>
          {this.renderCurrencyButtons(imageCurrencyTypes)}
        </ButtonGroup>
        <ButtonGroup>
          {this.renderCurrencyButtons(textCurrencyTypes)}
        </ButtonGroup>
      </div>
    )
  }
}

