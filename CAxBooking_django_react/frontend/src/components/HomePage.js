import React, { useEffect } from "react";
import './style.css'
import Login from "./LoginComponent/LoginPageComponent";
import RoomLayout from "./RoomLayoutComponent/RoomLayoutComponent";
import MainPage from "./MainPageComponent/MainPage"
import Admin from "./AdminComponent/AdminComponent";
import UserGuide from "./UserGuideComponent/UserGuide";
import AdminContact from "./AdminContactComponent/AdminContactComponent";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import Header from "./HeaderComponent/Header";
import Footer from "./FooterComponent/Footer";
import Axios from "axios";

/**
 * It returns a Router component that contains a Switch component that contains a Route component for
 * each page in the app
 */
export default function HomePage() {

  const [currentUser, setCurrentUser] = React.useState(null);

  const fetchCurrentUser = () => {
    Axios.get("http://"+process.env.PRODIP+"/api/users/getCurrent").then(res => {
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

        </Switch>
      </Router>

      <Footer />
    </div>
  );

}