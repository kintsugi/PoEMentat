import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  Tabs,
  Tab
} from 'react-bootstrap'

export default class Tabs extends Component {
  render() {
    return (
      <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Tab 1">Tab 1 content</Tab>
        <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
        <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
      </Tabs>
    )
  }
}
