import React from 'react';
import './BookingPopUp.css'

/**
 * It returns a div with a title, some information, and two buttons
 * @param props - {
 * @returns A function that returns a div with the booking information.
 */
export default function BookingPopup(props) {

    function infoBox(name, data) {
        return (
            <div className='info-box'>
                <h3>{name}</h3>
                <hr />
                <p>{data}</p>
            </div>
        );
    }

    return (
        <div className='popup' id={"PopupBookingNb" + props.id}>

            <h1>Reservation Information</h1>
            <div className='info'>
                {infoBox("Computer", props.computer)}
                {infoBox("Room", props.room)}
                {infoBox("Date", props.date)}
                {infoBox("Duration", props.duration)}
            </div>
            <button className='CAxButton' onClick={() => {

                props.close();
            }}>Close</button>
            <button className='CAxButton' onClick={() => {
                fetch('http://127.0.0.1:8000/api/bookings/delete?book_id=' + props.id, {
                    method: "GET"
                }).then(respnose => {
                    return respnose.text;
                });
                props.close();
                props.cancel(props.id);
            }}>Cancel</button>
        </div>
    );
}