import React, { Component } from 'react'
import CurrencyStashTab from './CurrencyStashTab'
import {
  Grid,
  Row,
  Col,
  Label
} from 'react-bootstrap'
import CurrencyImg from './CurrencyImg'

export default class Home extends Component {

  render() {
    console.log(this.props)
    return (
      <Grid>
        <Row className="show-grid">
          <Col className={'text-center'} xs={12}>
            <br />
            <Label>Total Worth:</Label> {parseFloat(this.props.inventory.totalWorth.sellWorth.toFixed(2))} <CurrencyImg inline={true} currencyType={this.props.currencyTypes.nameDict['chaos']} />
          </Col>
          <CurrencyStashTab inventory={this.props.inventory} />
        </Row>
      </Grid>
    )
  }
}

