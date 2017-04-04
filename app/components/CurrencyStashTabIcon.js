import React, { Component } from 'react'
const currencyPositions = require('../data/currency-positions')
import {
  Button
} from 'react-bootstrap'
import styles from './CurrencyStashTabIcon.css'

export default class CurrencyStashTabIcon extends Component {

  render() {
    return (
      <Button
        key={this.props.id}
        style={{
        position: 'absolute',
        left: this.props.position.x,
        top: this.props.position.y,
      }}>
        <div className={styles.currencyCountText}>{this.props.inventoryItem.count}</div>
        <img className={styles.currencyStashImg} src={this.props.inventoryItem.imgFilename} />
      </Button>
    )
  }
}

