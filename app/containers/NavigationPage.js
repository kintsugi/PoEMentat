import React, { Component } from 'react'
import Navigation from '../components/Navigation'
import HomePage from './HomePage'
import SettingsPage from './SettingsPage'
import MarketPage from './MarketPage'
import ShopPage from './ShopPage'
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
    path: '/market',
    title: 'Market',
    component: MarketPage,
  },
  {
    path: '/shop',
    title: 'Shop',
    component: ShopPage,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: SettingsPage,
  },
]


export default class NavigationPage extends Component {

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
