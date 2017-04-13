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
          <Nav activeKey="0" bsStyle="tabs" activeKey="0" >
            {this.props.routes.map((route, index) => (
              <NavItem key={index} href={`#${route.path}`} title={route.title}>{route.title}</NavItem>
            ))}
          </Nav>
          <Router history={this.props.history} routes={this.props.routes}/>
        </div>
      </div>
    )
  }
}
