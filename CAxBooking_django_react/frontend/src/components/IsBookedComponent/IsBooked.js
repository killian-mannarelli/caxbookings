import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import "./isBooked.css"

export default function IsBooked() {
    const { host_name } = useParams();
    const [nextBook, setNextBook] = useState()
    const [nextBookEnd, setNextBookEnd] = useState()
    const [PCName, setPCName] = useState()

    useEffect(() => {
        getNextBooking()
    }, [nextBook]);


    function getNextBooking() {
        let CSRF_TOKEN = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        Axios.post("http://"+process.env.PRODIP+"/api/computers/nextBook", {
            host_name: host_name
        },{
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

        }).then(
            res => {
                if (res.data.next_booking != "none") {
                    setNextBook(res.data.next_booking)
                    setNextBookEnd(res.data.next_booking_end)
                    setPCName(res.data.PC_name)
                } else {
                    setNextBook(undefined)
                }
            }
        )
    }
    return (

        <div id="ComputerBooked">
            {nextBook &&
                <div id="ComputerBookedContent" className="background">

                    <h2> This computer {PCName} is booked today from {nextBook} to {nextBookEnd}</h2>
                    <p>
                        Please leave access to this computer for the person who made the booking.
                    </p>
                </div>
            }
            {!nextBook &&
                <div id="ComputerBookedContent" className="background">

                    <h2> Try booking this computer on the Computer Booking Service  </h2>
                    <p>
                        You can try booking this computer, {PCName}, on the Computer Resevation Service website, so that someone doesn't book it while you are using it.
                    </p>
                </div>}
        </div>
    )

}