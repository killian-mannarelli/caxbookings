import React, { useEffect } from "react";

import Header from "./HeaderComponent/Header";
import Footer from "./FooterComponent/Footer";
import Login from "./LoginComponent/LoginPageComponent";
import RoomLayout from "./RoomLayoutComponent/RoomLayoutComponent";
import MainPage from "./MainPageComponent/MainPage"
import Admin from "./AdminComponent/AdminComponent";
import UserGuide from "./FooterComponent/UserGuideComponent/UserGuide";
import AdminContact from "./FooterComponent/AdminContactComponent/AdminContactComponent";
import IsBooked from "./IsBookedComponent/IsBooked";
import './style.css'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import Axios from "axios";

/**
 * It returns a Router component that contains a Switch component that contains a Route component for
 * each page in the app
 */
export default function HomePage() {

  const [currentUser, setCurrentUser] = React.useState(null);

  const fetchCurrentUser = () => {
    Axios.get("http://127.0.0.1:8000/api/users/getCurrent").then(res => {
      setCurrentUser(res.data[0]);
    }
    );
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div id="page">
      <Header currentUser={currentUser} />

      <Router>
        <Switch>
          <Route exact path={'/'}>
            <MainPage currentUser={currentUser} />
          </Route>

          <Route path={'/login'}>
            <Login />
          </Route>

          <Route path={'/admin'}>
            <Admin currentUser={currentUser} />
          </Route>

          <Route path={'/userGuide'}>
            <UserGuide currentUser={currentUser} />
          </Route>

          <Route path={'/adminContact'}>
            <AdminContact currentUser={currentUser} />
          </Route>

          <Route path={'/room/room_id=:id&start=:tss&stop=:tse'}>
            <RoomLayout currentUser={currentUser} />
          </Route>

          <Route path={'/isBooked/:host_name'}>
            <IsBooked />
          </Route>

        </Switch>
      </Router>

      <Footer />
    </div>
  );

}