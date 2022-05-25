import './MainPage.css';
import React, { useState, useEffect } from 'react';
import RoomDisplay from './RoomDisplayComponent/RoomDisplay';
import TimeSpan from './TimeSpanComponent/TimeSpan';
import Bookings from './BookingComponent/Bookings';
import Header from '../HeaderComponent/Header';
import Axios from 'axios';
import Footer from '../FooterComponent/Footer';

/**
 * It fetches the current user, then fetches the rooms, then renders the header, bookings, timespan and
 * roomdisplay components
 * @returns The MainPage component is being returned.
 */
export default function MainPage(props) {


  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rooms, setRooms] = React.useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(
    () => {

      fetchRooms();
    }, [startDate, endDate]
  )
  

  

  const fetchRooms = () => {
      let startDateIso = startDate.toISOString();
      let endDateIso = endDate.toISOString();
      Axios.get("http://127.0.0.1:8000/api/rooms/search?time_start="+startDateIso+"&time_end=" + endDateIso).then(res => {
          setRooms(res.data);
          
      });
  }

/**
 * It takes in a day, start time and end time and returns a start date and end date
 * @param day - The day that the user has selected.
 * @param start - The start time of the event
 * @param end - The end time of the event.
 */


  const callBackFromTimeSpan = (day, start, end) => {

    let StartDate = new Date(day.toISOString());
    StartDate.setHours(start.getHours()+2);
    StartDate.setMinutes(start.getMinutes());
    StartDate.setSeconds(start.getSeconds());
    let EndDate = new Date(day.toISOString());
    EndDate.setHours(end.getHours()+2);
    EndDate.setMinutes(end.getMinutes());
    EndDate.setSeconds(end.getSeconds());
    setStartDate(StartDate);
    setEndDate(EndDate);
  }

  return (
    <div className="MainPage">
      {props.currentUser && <Bookings user_id={props.currentUser.id} />}
      <TimeSpan callback = {callBackFromTimeSpan}/>
      <RoomDisplay start = {startDate.toISOString()} end = {endDate.toISOString()} rooms = {rooms}/>
    </div>
  );
}





