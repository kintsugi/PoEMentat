import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  Dropdown,
  Button,
  MenuItem,
} from 'react-bootstrap'
import styles from './MainCurrencyDropdown.css'
import MainCurrencySelectable from './MainCurrencySelectable'

export default class MainCurrencyDropdown extends Component {

  constructor(props) {
    super(props)
    let quickSelections = this.props.quickSelections.map((currencyId) => {
      return this.props.currencyTypes.idDict[currencyId]
    })
    let selections = this.props.currencyTypes.list.filter((currencyType) => {
      return this.props.quickSelections.indexOf(parseInt(currencyType.id)) == -1
    })
    this.state = {
      quickSelections,
      selections,
    }
  }

  renderSelections(selections) {
    let renderedSelections = selections.map((currencyType) =>
      <MainCurrencySelectable
        key={currencyType.id}
        currencyType={currencyType}
        onSelectMainCurrency={this.props.onSelectMainCurrency}
      />
    )
    return (
      renderedSelections
    )
  }

  render() {
    return (
      <Dropdown id="main-currency-dropdown">
        <Dropdown.Toggle >
          <MainCurrencySelectable
            key={0}
            currencyType={this.props.currencyTypes.idDict[this.props.selectedCurrencies.main]}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu bsStyle=" currency-dropdown-menu">
          {this.renderSelections(this.state.quickSelections)}
          <MenuItem divider />
          {this.renderSelections(this.state.selections)}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

