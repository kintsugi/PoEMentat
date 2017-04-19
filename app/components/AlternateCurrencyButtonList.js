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
    let filteredCurrencyTypes = currencyTypes.filter((currencyType) => {
      return this.checkFilter(currencyType)
    })
    let currencyButtons = filteredCurrencyTypes.map((currencyType) => {
      let market = this.props.markets[this.props.selectedCurrencies.main][currencyType.id]
      let shop = this.props.shop[this.props.selectedCurrencies.main][currencyType.id]
      let enabledButtonBsStyle = null
      if(shop && (shop.overridden || shop.autotradeEnabled)) {
        enabledButtonBsStyle = {bsStyle: 'success'}
      }
      let ROI
      if(market) {
        ROI = market.bestOfferDetails.ROI || ''
      }
      if(ROI) {
        ROI = parseFloat(ROI.toFixed(2))
      }
      return  (
        <Button
          style={{verticalAlign: 'middle'}}
          onClick={() => {
            this.props.onSelectAlternateCurrency(currencyType.id)
          }}
          className={styles.currencyBtn}
          {...enabledButtonBsStyle}
          key={currencyType.id}>
          <div className={styles.currencyCountText}>{ROI}</div>
          <CurrencyImg currencyType={currencyType} />
        </Button>
      )
    })
    return (
      currencyButtons
    )
  }

  compareCurrencyByROI(typeA, typeB) {
    let marketA = this.props.markets[this.props.selectedCurrencies.main][typeA.id]
    let marketB = this.props.markets[this.props.selectedCurrencies.main][typeB.id]
    if(!marketA && marketB) {
      return 1
    } else if(marketA && !marketB) {
      return -1
    } else if(!marketA && !marketB) {
      return 0
    }
    let aROI = marketA.bestOfferDetails.ROI
    let bROI = marketB.bestOfferDetails.ROI
    if(!aROI && bROI) {
      return 1
    } else if(aROI && !bROI) {
      return -1
    } else if(!aROI && !bROI) {
      return 0
    } else if(aROI < bROI) {
      return -1
    } else if(aROI > bROI) {
      return 1
    } else {
      return 0
    }
  }

  render() {
    let textCurrencyTypes = this.props.currencyTypes.list.filter((currencyType) => {
      return textCurrencies.indexOf(currencyType.category) != -1
    }).sort((a, b) => this.compareCurrencyByROI(a, b))
    let imageCurrencyTypes = this.props.currencyTypes.list.filter((currencyType) => {
      return textCurrencies.indexOf(currencyType.category) == -1
    }).sort((a, b) => this.compareCurrencyByROI(a, b))

    return (
      <div style={{paddingTop: '2px'}}>
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

