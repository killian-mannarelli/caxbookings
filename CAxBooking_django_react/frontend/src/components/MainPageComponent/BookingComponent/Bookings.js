import './Bookings.css'
import React, { useEffect, useState } from 'react';
import Booking from './Booking';

/**
 * It fetches the bookings from the API, and displays them in a table
 * @param props - the props that are passed to the component
 * @returns A table with the ongoing bookings.
 */
export default function Bookings(props) {


    let [books, setBookings] = useState();

    /**
     * It fetches the bookings from the API and then sets the state of the bookings to the fetched
     * bookings
     * @returns A list of bookings
     */
    function fetchBookings() {
        fetch("http://"+process.env.PRODIP+"/api/bookings/search?user_id=" + props.user_id + "&status2=2&status=1", {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            let list = JSON.parse(data);
            setBookings(list.map((val, key) => {

                return <tr id={"bookingNb" + val.id} key={key}  >
                    <td className={"status" + val.status}>
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
            <table className="content-table background">
                <tbody id='BookingsList'>
                    {books && books}
                </tbody>
            </table>
        </div >
    );


};

