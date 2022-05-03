import './MainPage.css';
import React, { useState, useEffect } from 'react';
import RoomDisplay from './RoomDisplayComponent/RoomDisplay';
import TimeSpan from './TimeSpanComponent/TimeSpan';
import Bookings from './BookingComponent/Bookings';
import Header from './Header';
import axios from 'axios';

export default function MainPage() {

  const [user, setUser] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rooms, setRooms] = React.useState([]);

  function fetchUser() {
    fetch("http://127.0.0.1:8000/api/users/getCurrent", {
      method: "GET"
    }).then(response => {
      return response.text();
    }).then(data => {
      let item = JSON.parse(data);
      setUser(item[0]);
    });
  };

  useEffect(() => {
    fetchRooms();
    fetchUser();
  }, []);

  useEffect(
    () => {

      fetchRooms();
    }, [startDate, endDate]
  )
  

  

  const fetchRooms = () => {
      let startDateIso = startDate.toISOString();
      let endDateIso = endDate.toISOString();
      axios.get("http://127.0.0.1:8000/api/rooms/search?time_start="+startDateIso+"&time_end=" + endDateIso).then(res => {
          setRooms(res.data);
          
      });
  }


  const callBackFromTimeSpan = (day, start, end) => {

    let StartDate = new Date(day.toISOString());
    StartDate.setHours(start.getHours());
    StartDate.setMinutes(start.getMinutes());
    StartDate.setSeconds(start.getSeconds());
    let EndDate = new Date(day.toISOString());
    EndDate.setHours(end.getHours());
    EndDate.setMinutes(end.getMinutes());
    EndDate.setSeconds(end.getSeconds());
    setStartDate(StartDate);
    setEndDate(EndDate);



  }

  return (
    <div className="MainPage">
      <Header />
      {user && <Bookings user_id={user.id} />}
      <TimeSpan callback = {callBackFromTimeSpan}/>
      <RoomDisplay start = {startDate.toISOString()} end = {endDate.toISOString()} rooms = {rooms}/>

    </div>
  );
}





