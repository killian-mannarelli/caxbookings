import React, { useEffect, useMemo } from "react";
import Axios from "axios";

export default function ModifyMaxBookingTimeComponent(props) {

    const [maxBookingTime, setMaxBookingTime] = React.useState(0);


    useEffect(() => {
        fetchMaxBookingTime();
    }
    , []);

    const maxBookingTextValue = useMemo(() => {
        if(maxBookingTime.max_booking_time == 0) return "No limit";
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
        } , 
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
        <input id = "newvalue" type="number"></input>
        <button className="login-logout CAxButton" onClick={() => {
            modifyMaxBookingTime();
        }}>Modify</button>

        </div>
    );
    
}