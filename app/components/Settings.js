import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col,
  ButtonToolbar,
  DropdownButton,
  Button,
  PageHeader,
  MenuItem,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap'

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  )
}
export default class Settings extends Component {
  constructor(props) {
    super(props)
  }

  onSettingsChange(value) {
    let nextState = Object.assign({}, this.state, value)
    this.setState(nextState)
  }

  onSubmit() {
    this.props.onSettingsChange(this.state)
  }

  render() {
    return (
      <div>
        <br />
        <form>
          <FieldGroup
            id="poeUsername"
            type="text"
            label="PoE Username"
            onBlur={event => this.onSettingsChange({poeUsername: event.target.value})}
            defaultValue={this.props.settings.poeUsername}
          />
          <FieldGroup
            id="leagueName"
            type="text"
            label="League Name"
            onBlur={event => this.onSettingsChange({leagueName: event.target.value})}
            defaultValue={this.props.settings.leagueName}
          />
          <FieldGroup
            id="poeTradeAPIKey"
            type="text"
            label="poe.trade API Key"
            onBlur={event => this.onSettingsChange({poeTradeAPIKey: event.target.value})}
            defaultValue={this.props.settings.poeTradeAPIKey}
          />
          <FieldGroup
            id="poeSessionId"
            type="text"
            label="pathofexile.com Session ID"
            onBlur={event => this.onSettingsChange({poeSessionId: event.target.value})}
            defaultValue={this.props.settings.poeSessionId}
          />
          <FieldGroup
            id="usernameWhiteList"
            type="text"
            label="Username Whitelist (CSV)"
            onBlur={event => this.onSettingsChange({usernameWhitelist: event.target.value.split(',')})}
            defaultValue={this.props.settings.usernameWhitelist.join(',')}
          />
          <Button onClick={this.onSubmit.bind(this)}>
            Save
          </Button>
        </form>
      </div>
    )
  }
}
