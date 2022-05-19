import React, { useEffect, useMemo } from "react";
import Axios from "axios";

/**
 * It fetches the current max booking time from the backend, and then allows the user to modify it
 * @param props - This is the props that are passed to the component.
 * @returns A component that displays the current max booking time and allows the user to modify it.
 */
export default function ModifyMaxBookingTimeComponent(props) {

    const [maxBookingTime, setMaxBookingTime] = React.useState(0);


    useEffect(() => {
        fetchMaxBookingTime();
    }
        , []);

    /* A hook that is used to memoize the value of the maxBookingTextValue. It is used to prevent the
    component from re-rendering when the value of maxBookingTime changes. */
    const maxBookingTextValue = useMemo(() => {
        if (maxBookingTime.max_booking_time == 0) return "No limit";
        console.log(maxBookingTime)
        return maxBookingTime.max_booking_time + " hours";
    }
        , [maxBookingTime]);


    const fetchMaxBookingTime = () => {
        Axios.get("http://127.0.0.1:8000/api/bookings/maxtime").then(res => {
            setMaxBookingTime(res.data);
        }
        );
    }

    const getCookie = (name) => {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const modifyMaxBookingTime = () => {
        const csrfToken = getCookie('csrftoken');
        Axios.post("http://127.0.0.1:8000/api/bookings/maxtime/modify", {
            max_booking_time: document.getElementById("newvalue").value
        },
            {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            }
        ).then(res => {
            fetchMaxBookingTime();
        }
        );
    }



    return (
        <div>
            <label>Current max Booking time : {maxBookingTextValue} </label>
            <input id="newvalue" type="number"></input>
            <button className="login-logout CAxButton" onClick={() => {
                modifyMaxBookingTime();
            }}>Modify</button>

        </div>
    );

}