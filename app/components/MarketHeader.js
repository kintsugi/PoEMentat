import React, { Component } from 'react'
import {
  Col,
  PageHeader
} from 'react-bootstrap'

export default class MarketHeader extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    if(!this.props.selectedCurrencies.main || !this.props.selectedCurrencies.alternate) {
      return (<div />)
    }
    let market = this.props.markets[this.props.selectedCurrencies.main][this.props.selectedCurrencies.alternate]
    return (
      <Col xs={12}><PageHeader>{market.alternateCurrencyType.fullName}</PageHeader></Col>
    )
  }
}

