import './Bookings.css'
import React from 'react';
import Booking from './Booking';

const data = [
    { room_name: "PC1 - H133 - 14H - 12/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
    { room_name: "PC1 - H133 - 14H - 15/02" },
]

export default function Bookings(props) {


    let [books, setBookings] = React.useState(fetchBookings);

    function fetchBookings() {

        fetch("http://127.0.0.1:8000/api/bookings/search?user_id=" + props.user_id , {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            let list = JSON.parse(data);
            setBookings(list.map((val, key) => {
                return <tr key={key}>
                    <td> <Booking computer={val.computer}/></td>
                </tr>
            }))

        }.bind(this));
    };

    return (
        <div className="Bookings">
            <p>Ongoing Bookings : </p>
            <table className="content-table">
                <tbody>
                    {books}
                </tbody>
            </table>
        </div >
    );


};

