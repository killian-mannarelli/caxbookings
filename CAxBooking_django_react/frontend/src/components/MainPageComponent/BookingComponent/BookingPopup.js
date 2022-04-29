import React from 'react';
import './BookingPopUp.css'

export default function BookingPopup(props) {

    function infoBox(name, data) {
        return (
            <div className='info-box'>
                <h3>{name}</h3>
                <hr />
                <p>{data}</p>
            </div>
        )
    }


    return (
        <div className='popup' id={props.id}>

            <h1>Reservation Information</h1>
            <div className='info'>
                {infoBox("Computer", props.computer)}
                {infoBox("Room", props.room)}
                {infoBox("Date", props.date)}
                {infoBox("Duration", props.duration)}
            </div>
            <button className='CAxButton' onClick={props.close}>Close</button>
            <button className='CAxButton'>Cancel</button>
        </div>
    );
}