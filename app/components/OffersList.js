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

const offersToShow = 5

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
        <Col xs={6} >
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
    let highlightedUsernames = this.props.settings.usernameWhitelist.concat([this.props.settings.poeUsername])
    if(highlightedUsernames.indexOf(offer.username) > -1) {
      offerContainerStyle.push(styles.highlightedOffer)
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
      <Col xs={12} key={key}>
        {this.renderOffer(buyOffer, 'buy')}
        {this.renderOffer(sellOffer, 'sell')}
      </Col>
    )
  }

  render() {
    if(!this.props.selectedCurrencies.main || !this.props.selectedCurrencies.alternate) {
      return (<div />)
    }

    let buyOffers, sellOffers
    let alternateOffers = this.props.offers[this.props.selectedCurrencies.alternate] || []
    let mainOffers = this.props.offers[this.props.selectedCurrencies.main] || []
    buyOffers = alternateOffers[this.props.selectedCurrencies.main] || {}
    sellOffers = mainOffers[this.props.selectedCurrencies.alternate] || {}
    buyOffers = buyOffers.list || []
    sellOffers = sellOffers.list || []
    let offerPairs = []
    let buyLimit = offersToShow == 0 ? buyOffers.length : Math.min(buyOffers.length, offersToShow)
    let sellLimit = offersToShow == 0 ? sellOffers.length : Math.min(sellOffers.length, offersToShow)

    for(let i = 0, j = 0; i < buyLimit  ||  j < sellLimit; ++i, ++j) {
      offerPairs.push([buyOffers[i], sellOffers[j]])
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

