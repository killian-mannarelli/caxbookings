import React from "react";
import GraphsBookingOverX from "./GraphsBookingOverX";
import MostBookedRoomComponent from "./MostBookedRoomComponent";    
import Axios from "axios";
import './StatsComponent.css'

/**
 * It returns a div with a MostBookedRoomComponent, a GraphsBookingOverX and a button that downloads
 * the database as a csv file
 * @returns A div with the id "Statistics" containing the MostBookedRoomComponent, GraphsBookingOverX
 * and a button to download the database as a csv file.
 */
export default function Stats(){


    return(
        <div id="Statistics">
            <MostBookedRoomComponent /> 
            <GraphsBookingOverX />
            <div className="otherStats">
                <button className="CAxButton" onClick={()=>{
                    window.location.replace("http://"+process.env.PRODIP+"/api/db/bookings")
                }}>Download database as csv</button>
            </div>
        </div>
    )
}