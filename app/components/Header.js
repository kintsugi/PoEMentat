import React, { Component } from 'react'
import { Link } from 'react-router'
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap'

export default class Header extends Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">PoEMentat</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="#">Help</NavItem>
            <NavItem href="#">Github</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
