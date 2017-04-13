import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Settings from '../components/Settings'
import * as SettingsActions from '../actions/settings'

class SettingsPage extends Component {

  onSettingsChange(nextSettings) {
    let { changeSettings } = this.props
    changeSettings(nextSettings)
  }

  render() {
    return (
      <Settings
        settings={this.props.settings}
        onSettingsChange={this.onSettingsChange.bind(this)}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...SettingsActions,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
