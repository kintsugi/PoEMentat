import React, { Component } from 'react'
import CurrencyStashTab from './CurrencyStashTab'
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'

export default class Home extends Component {

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <CurrencyStashTab inventory={this.props.inventory} />
        </Row>
      </Grid>
    )
  }
}

