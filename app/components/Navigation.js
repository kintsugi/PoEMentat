import React, { Component } from 'react'
import { Router, Route } from 'react-router'
import Header from './Header'
import {
  Nav,
  NavItem,
} from 'react-bootstrap'

export default class Navigation extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <Header/>
        <div className="container">
          <Nav bsStyle="tabs" activeKey="0" onSelect={this.props.handleSelect}>
            {this.props.routes.map((route, index) => (
              <NavItem key={index} eventKey={index} title={route.title}>{route.title}</NavItem>
            ))}
          </Nav>
          <Router history={this.props.history}>
            {this.props.routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                component={route.component}
              />
            ))}
          </Router>
        </div>
      </div>
    )
  }
}
