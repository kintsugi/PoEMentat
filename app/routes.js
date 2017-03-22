import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/Homepage';
import SettingsPage from './containers/SettingsPage';
import Header from './components/Header'
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
  }
]

export default (
  <div>
    <Header/>
    <div className="container">
      <Nav bsStyle="tabs" activeKey="0">
        {routes.map((route, index) => (
          <NavItem key={index} eventKey={index} title={route.title} href={route.path}>{route.title}</NavItem>
        ))}
      </Nav>
      {routes.map((route, index) => (
        <Route
          key={index}
          component={route.component}
        />
      ))}
    </div>
  </div>
);
