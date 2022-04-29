import './MainPage.css';
import React, { useState, useEffect } from 'react';
import RoomDisplay from './RoomDisplayComponent/RoomDisplay';
import TimeSpan from './TimeSpanComponent/TimeSpan';
import Bookings from './BookingComponent/Bookings';
import Header from './Header';

export default function MainPage() {

  const [user, setUser] = useState();

  function fetchUser() {
    fetch("http://127.0.0.1:8000/api/users/getCurrent", {
      method: "GET"
    }).then(response => {
      return response.text();
    }).then(data => {
      let item = JSON.parse(data);
      console.log(item)
      console.log(item[0])
      setUser(item[0]);
    });
  };

  useEffect(() => {
    fetchUser()
  }, []);

  return (
    <div className="MainPage">
      <Header />
      {user && <Bookings user_id={user?.id ?? 0} />}
      <TimeSpan />
      <RoomDisplay />

    </div>
  );
}





