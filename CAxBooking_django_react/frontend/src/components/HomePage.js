import React from "react";
import Login from "./LoginComponent/LoginPageComponent";
import RoomLayout from "./RoomLayoutComponent/RoomLayoutComponent";
import MainPage from "./MainPageComponent/MainPage"

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";

export default function HomePage() {


  return (
    <Router>
      <Switch>
        <Route exact path={'/'}>
          <MainPage />
        </Route>

        <Route path={'/login'}>
          <Login />
        </Route>

        <Route path={'/room/room_id=:id&start=:tss&stop=:tse'}>
          <RoomLayout />
        </Route>

      </Switch>
    </Router>
  );

}