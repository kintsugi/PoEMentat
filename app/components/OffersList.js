import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  DropdownButton,
  Button,
  MenuItem,
  PageHeader,
} from 'react-bootstrap'
import MarketButtonToolbar from './MarketButtonToolbar'
import AlternateCurrencyButtonList from './AlternateCurrencyButtonList'
import CurrencyImg from './CurrencyImg'
import styles from './OffersList.css'

const offersToShow = 3

export default class OffersList extends Component {

  constructor(props) {
    super(props)
  }

  renderCurrencyImg(currencyType) {
    return (
      <CurrencyImg currencyType={currencyType} inline={true}/>
    )
  }

  renderOffer(offer, type) {
    if(!offer) {
      return (
        <Col xs={12} >
        </Col>
      )
    }

    let offerContainerStyle = null
    let offerPrefix = ""
    let offerSuffix = ""
    let leftImg = null
    let rightImg = null
    let leftValue = 0
    let rightValue = 0

    if(type == 'buy') {
      offerContainerStyle = [styles.offerBorder, styles.offerContainer, styles.leftOfferContainer]
      offerPrefix = "You buy "
      leftValue = parseFloat(offer.buy_value)
      leftImg = this.renderCurrencyImg(offer.buyCurrencyType)
      offerSuffix = " and give "
      rightValue = parseFloat(offer.sell_value)
      rightImg = this.renderCurrencyImg(offer.sellCurrencyType)
    } else if(type == 'sell') {
      offerContainerStyle = [styles.offerBorder, styles.offerContainer, styles.rightOfferContainer]
      offerPrefix = "You sell "
      leftValue = parseFloat(offer.sell_value)
      leftImg = this.renderCurrencyImg(offer.sellCurrencyType)
      offerSuffix = " and get "
      rightValue = parseFloat(offer.buy_value)
      rightImg = this.renderCurrencyImg(offer.buyCurrencyType)
    }

    return (
      <Col className={offerContainerStyle} xs={6}>
        <Col xs={3}>
          {parseFloat(offer.ratios.buyPerSell.toFixed(4))} {this.renderCurrencyImg(offer.buyCurrencyType)} for 1 {this.renderCurrencyImg(offer.sellCurrencyType)}
        </Col>
        <Col className="text-center" xs={6}>
          {offerPrefix} {leftValue} {leftImg} {offerSuffix} {rightValue} {rightImg}
        </Col>
        <Col xs={3}>
          1 {this.renderCurrencyImg(offer.buyCurrencyType)} for {parseFloat(offer.ratios.sellPerBuy.toFixed(4))} {this.renderCurrencyImg(offer.sellCurrencyType)}
        </Col>
        <Col className={["text-center", styles.offerOwnerContainer]} xs={6}>
          IGN: {offer.ign}
        </Col>
        <Col className={["text-center", styles.offerOwnerContainer]} xs={6}>
          Username: {offer.username}
        </Col>
      </Col>
    )
  }

  renderOfferPair(buyOffer, sellOffer) {
    let key = (buyOffer ? buyOffer.username : 'none1') + '-' + (sellOffer ? sellOffer.username : 'none2') + Date.now()
    return (
      <div key={key}>
        {this.renderOffer(buyOffer, 'buy')}
        {this.renderOffer(sellOffer, 'sell')}
      </div>
    )
  }

  render() {
    if(!this.props.selectedCurrencies.main || !this.props.selectedCurrencies.alternate) {
      return (<div />)
    }
    let buyOffers = this.props.offers[this.props.selectedCurrencies.alternate][this.props.selectedCurrencies.main].list
    let sellOffers = this.props.offers[this.props.selectedCurrencies.main][this.props.selectedCurrencies.alternate].list
    let offerPairs = []
    for(let i = 0; i < Math.min(buyOffers.length, offersToShow) ||  i < Math.min(sellOffers.length, offersToShow); ++i) {
      offerPairs.push([buyOffers[i], sellOffers[i]])
    }

    return (
      <div>
        <Col xs={6}>
          <PageHeader>Buy Orders</PageHeader>
        </Col>
        <Col xs={6}>
          <PageHeader>Sell Orders</PageHeader>
        </Col>
        {offerPairs.map((offerPair) => this.renderOfferPair(offerPair[0], offerPair[1]))}
      </div>
  )
  }
}

