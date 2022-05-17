import React from "react";
import GraphsBookingOverX from "./GraphsBookingOverX";
import MostBookedRoomComponent from "./MostBookedRoomComponent";    
import './StatsComponent.css'

export default function Stats(){


    return(
        <div id="Statistics">
            <MostBookedRoomComponent /> 
            <GraphsBookingOverX />
            <div className="otherStats"></div>
        </div>
    )
}