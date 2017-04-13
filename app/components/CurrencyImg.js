import React, { Component } from 'react'
const constants = require('../constants.json')
import styles from './CurrencyImg.css'
import '../static/css/currency_32.global.css'


export default class CurrencyImg extends Component {

  render() {
    let id = this.props.id || this.props.currencyType.id
    if(this.props.currencyType && constants.misc.textCurrencyTypes.indexOf(this.props.currencyType.category) != -1) {
      return <span>{this.props.currencyType.name}</span>
    } else if(this.props.inline) {
      return (
        <div className={styles.currencyImg}>
          <div className={`cur32-${id}`}/>
        </div>
      )
    } else {
      return <div className={`cur32-${id}`}/>
    }
  }
}

