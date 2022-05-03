import './Bookings.css'
import React, { useEffect, useState } from 'react';
import Booking from './Booking';

export default function Bookings(props) {


    let [books, setBookings] = useState();

    function fetchBookings() {
        fetch("http://127.0.0.1:8000/api/bookings/search?user_id=" + props.user_id, {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            let list = JSON.parse(data);
            setBookings(list.map((val, key) => {
                return <tr id={"bookingNb" + val.id} key={key}>
                    <td>
                        <Booking
                            computer={val.computer}
                            start={val.start}
                            end={val.end}
                            booking={val.id}
                            cancel={cancelBbooking} />
                    </td>
                </tr>
            }));
        }.bind(this));

    };

    useEffect(() => {
        fetchBookings()
        console.log(books);
    }, [])

    function cancelBbooking(idBook) {
        let child = document.getElementById("bookingNb" + idBook);
        let parent = document.getElementById("BookingsList");

        // Delete child
        parent.removeChild(child);
    }

    return (
        <div className="Bookings">

            <div id='popup-back'></div>
            <p>Ongoing Bookings : </p>
            <table className="content-table">
                <tbody id='BookingsList'>
                    {books && books}
                </tbody>
            </table>
        </div >
    );


};

