import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'
import CurrencyStashTabIcon from './CurrencyStashTabIcon'
const currencyPositions = require('../data/currency-positions')

export default class CurrencyStashTab extends Component {

  render() {
    return (
      <Col sm={6}>
        <div className='text-center' style={{position:'relative'}}>
        {Object.keys(currencyPositions).map((i) => {
          return(
            <CurrencyStashTabIcon
              key={i}
              id={i}
              position={{
                x: currencyPositions[i].x * 1.0,
                y: currencyPositions[i].y * 1.0,
              }}
              inventoryItem={this.props.inventory.idDict[i]}
            />
          )
        })}
        </div>
      </Col>
    )
  }
}

