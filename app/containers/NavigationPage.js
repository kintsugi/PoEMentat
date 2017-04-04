import React, { Component } from 'react'
import Navigation from '../components/Navigation'
import HomePage from './HomePage'
import SettingsPage from './SettingsPage'
import MarketPage from './MarketPage'
import Header from '../components/Header'
import {
  Nav,
  NavItem,
} from 'react-bootstrap'


const routes = [
  {
    path: '/',
    title: 'Home',
    component: HomePage,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: SettingsPage,
  },
  {
    path: '/market',
    title: 'Market',
    component: MarketPage,
  }
]


export default class NavigationPage extends Component {

  handleSelect(event) {
    let route = routes[event].path
    window.location.hash = `#${route}`
  }

  render() {
    return (
      <Navigation
        handleSelect={this.handleSelect}
        history={this.props.history}
        routes={routes}
      />
    )
  }
}
