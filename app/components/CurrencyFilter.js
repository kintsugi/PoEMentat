import React, { Component } from 'react'
import {
  Checkbox
} from 'react-bootstrap'
const constants = require('../constants')
import styles from './CurrencyFilter.css'

export default class CurrencyFilter extends Component {

  constructor(props) {
    super(props)
  }

  isChecked(categoryName) {
    return this.props.currencyFilter.indexOf(categoryName) != -1
  }

  render() {
    return (
      <div className={styles.container}>
        {Object.keys(constants.misc.currencyCategories).map((categoryName) =>
          <Checkbox
            key={categoryName}
            onChange={() => {this.props.onCurrencyFilterChange(categoryName)}}
            inline
            checked={this.isChecked(categoryName)}
          >
            {categoryName}
          </Checkbox>
        )}
      </div>
    )
  }
}

