import './Bookings.css'
import React from 'react';
import Booking from './Booking';

export default function Bookings(props) {


    let [books, setBookings] = React.useState(fetchBookings);

    function fetchBookings() {
        console.log(props.user_id)
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
                            booking={val.id} />
                    </td>
                </tr>
            }))

        }.bind(this));
    };

    return (
        <div className="Bookings">

            <div id='popup-back'></div>
            <p>Ongoing Bookings : </p>
            <table className="content-table">
                <tbody>
                    {books}
                </tbody>
            </table>
        </div >
    );


};

