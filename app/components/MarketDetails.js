import React, { Component } from 'react'
import {
  Col,
  PageHeader,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import styles from './MarketDetails.css'
import CurrencyImg from './CurrencyImg'

export default class MarketDetails extends Component {

  constructor(props) {
    super(props)
  }

  renderCurrencyImg(currencyType) {
    /*return (*/
      //<div className={styles.currencyImg}>
        //<CurrencyImg currencyType={currencyType} />
      //</div>
    /*)*/
  }

  render() {
    if(!this.props.selectedCurrencies.main || !this.props.selectedCurrencies.alternate) {
      return <div />
    }
    let market = this.props.markets[this.props.selectedCurrencies.main][this.props.selectedCurrencies.alternate]
    if(!market) {
      return <div />
    }
    let mainCurrencyImg = <CurrencyImg currencyType={market.mainCurrencyType} inline={true} />
    let bestROI = market.bestOfferDetails.ROI || 0
    let bestProfit = market.bestOfferDetails.profit || 0
    let topROI = market.topOfferDetails.ROI || 0
    let topProfit = market.topOfferDetails.profit || 0

    return (
      <div>
        <Col xs={6}>
          <InputGroup>
            <InputGroup.Addon>Best ROI</InputGroup.Addon>
            <div className={styles.detailForm}>
              To profit 1 {mainCurrencyImg} you need to invest {parseFloat(bestROI.toFixed(4))} {mainCurrencyImg}
            </div>
          </InputGroup>
        </Col>
        <Col xs={6}>
          <InputGroup>
            <InputGroup.Addon>Best Profit</InputGroup.Addon>
            <div className={styles.detailForm}>
              You profit {parseFloat(bestProfit.toFixed(4))} {mainCurrencyImg} for every 1 {mainCurrencyImg} invested
            </div>
          </InputGroup>
        </Col>
        <Col xs={6}>
          <br />
          <InputGroup>
            <InputGroup.Addon>Top ROI</InputGroup.Addon>
            <div className={styles.detailForm}>
              To profit 1 {mainCurrencyImg} you need to invest {parseFloat(topROI.toFixed(4))} {mainCurrencyImg}
            </div>
          </InputGroup>
        </Col>
        <Col xs={6}>
          <br />
          <InputGroup>
            <InputGroup.Addon>Top Profit</InputGroup.Addon>
            <div className={styles.detailForm}>
              You profit {parseFloat(topProfit.toFixed(4))} {mainCurrencyImg} for every 1 {mainCurrencyImg} invested
            </div>
          </InputGroup>
        </Col>
      </div>
    )
  }

}

