import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import './BookingPopUp.css'

/**
 * It returns a div with a title, some information, and two buttons
 * @param props - {
 * @returns A function that returns a div with the booking information.
 */
export default function BookingPopup(props) {

    const [open, setOpen] = useState(false);

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


            <button id='close-pop-up-button' className='CAxButton' onClick={() => {
                props.close();
            }}>Close</button>
<<<<<<< HEAD


            <button id='cancel-booking-button' className='CAxButton' onClick={() => {
                setOpen(true);
            }}>Cancel Booking</button>



            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Cancel Booking"}</DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure you want to cancel this booking ?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => { setOpen(false) }}>No</Button>
                    <Button onClick={() => {
                        setOpen(false);
                        fetch('http://127.0.0.1:8000/api/bookings/delete?book_id=' + props.id, {
                            method: "GET"
                        }).then(respnose => {
                            return respnose.text;
                        });
                        props.close();
                        props.cancel(props.id);
                    }}>Yes</Button>
                </DialogActions>
            </Dialog>
=======
            <button className='CAxButton' onClick={() => {
                fetch("http://"+process.env.PRODIP+"/api/bookings/delete?book_id=" + props.id, {
                    method: "GET"
                }).then(respnose => {
                    return respnose.text;
                });
                props.close();
                props.cancel(props.id);
            }}>Cancel</button>
>>>>>>> docker + making code adaptable to new ip
        </div>
    );
}