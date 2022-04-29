import './MainPage.css';
import React from 'react';
import RoomDisplay from './RoomDisplayComponent/RoomDisplay';
import TimeSpan from './TimeSpanComponent/TimeSpan';
import Bookings from './BookingComponent/Bookings';
import Header from './Header';

export default function MainPage() {
  return (
    <div className="MainPage">
      <Header />
      <Bookings user_id={2}/>
      <TimeSpan />
      <RoomDisplay />

    </div>
  );
}
