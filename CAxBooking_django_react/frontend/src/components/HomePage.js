import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Router>
          <Switch>
            <Route exact path={'/'}>
              <div>
                hello1
              </div>
            </Route>

            <Route path={'/join'}>
            <div>
                hello2
              </div>
            </Route>
          </Switch>
        </Router>
    );
  }
}