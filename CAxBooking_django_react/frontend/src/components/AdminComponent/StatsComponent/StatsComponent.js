import React from "react";
import GraphsBookingOverX from "./GraphsBookingOverX";
import MostBookedRoomComponent from "./MostBookedRoomComponent";    
import Axios from "axios";
import './StatsComponent.css'

export default function Stats(){


    return(
        <div id="Statistics">
            <MostBookedRoomComponent /> 
            <GraphsBookingOverX />
            <div className="otherStats">
                <button className="CAxButton" onClick={()=>{
                    window.location.replace("http://127.0.0.1:8000/api/db/bookings")
                }}>Download database as csv</button>
            </div>
        </div>
    )
}