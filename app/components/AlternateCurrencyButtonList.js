import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  Button,
  ButtonGroup,
  MenuItem,
} from 'react-bootstrap'
import styles from './AlternateCurrencyButtonList.css'

export default class AlternateCurrencyButtonList extends Component {

  constructor(props) {
    super(props)
  }

  renderCurrencyButtons() {
    let currencyButtons = this.props.currencyTypes.list.map((currencyType) =>
      <Button onClick={() => {
        this.props.onSelectAlternateCurrency(currencyType.id)
      }} className={styles.currencyBtn} key={currencyType.id}>
        <img className={styles.currencyImg} src={currencyType.imgFilename} />
      </Button>
    )
    return (
      currencyButtons
    )
  }

  render() {
    return (
      <ButtonGroup>
        {this.renderCurrencyButtons()}
      </ButtonGroup>
    )
  }
}

