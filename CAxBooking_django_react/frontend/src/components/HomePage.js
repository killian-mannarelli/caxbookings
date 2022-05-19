import React from "react";
import './style.css'
import Login from "./LoginComponent/LoginPageComponent";
import RoomLayout from "./RoomLayoutComponent/RoomLayoutComponent";
import MainPage from "./MainPageComponent/MainPage"
import Admin from "./AdminComponent/AdminComponent";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";

/**
 * It returns a Router component that contains a Switch component that contains a Route component for
 * each page in the app
 */
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

        <Route path={'/admin'}>
          <Admin />
        </Route> 

        <Route path={'/room/room_id=:id&start=:tss&stop=:tse'}>
          <RoomLayout />
        </Route>

      </Switch>
    </Router>
  );

}