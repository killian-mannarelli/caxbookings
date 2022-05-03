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
                return <tr key={key}>
                    <td>
                        <Booking
                            computer={val.computer}
                            start={val.start}
                            end={val.end}
                            booking={val.id}
                            reload={fetchBookings} />
                    </td>
                </tr>
            }));
        }.bind(this));

    };

    useEffect(() => {

        console.log(books);
    }, [])


    function cancelBooking(){

    }

    return (
        <div className="Bookings">

            <div id='popup-back'></div>
            <p>Ongoing Bookings : </p>
            <table className="content-table">
                <tbody>
                    {books && books}
                </tbody>
            </table>
        </div >
    );


};

