import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from '../components/Home'

class HomePage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Home
        inventory={this.props.inventory}
        currencyTypes={this.props.currencyTypes}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    inventory: state.inventory,
    currencyTypes: state.currencyTypes
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
