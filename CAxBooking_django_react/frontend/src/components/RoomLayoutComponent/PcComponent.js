//make me a react function component

import React from 'react';
import Grid from '@mui/material/Grid';
import ComputerIcon from '@mui/icons-material/Computer';

/**
 * It takes a pc object as a prop and returns a grid with the pc name and the image
 * @param props - the props that are passed to the component
 * @returns A grid with the pc name and the image
 */
export default function PcComponent(props) {
    const pc = props.pc;
    let nextBooking = pc.next_booking_time
    let nextBookingDuration = undefined
    if (pc.next_booking_duration != undefined) {
        nextBookingDuration = pc.next_booking_duration.split(":");
    }

    if (nextBooking == null) {
        nextBooking = "No bookings yet"
    } else {
        let date = nextBooking.split("-");
        let year = date[0];
        let month = date[1];
        let day = date[2].split("T")[0];
        let hour = date[2].split("T")[1].split(":")[0];
        let minutes = date[2].split("T")[1].split(":")[1];
        nextBooking = year + "/" + month + "/" + day + "  " + hour + ":" + minutes;
    }
    console.log(typeof (nextBooking), nextBooking)

    return (
        //make a grid with the pc name and the image
        <Grid item xs={4} sm={4} md={4} lg={4} >
            <Grid container direction="column" alignItems="center" wrap="wrap" justifyContent="center" onClick={() => {
                props.onClick(pc)
            }} className="pc">

                <Grid item xs={12} justifyContent="center" >
                    {pc.computer_status == 0 &&
                        <ComputerIcon sx={{ fontSize: 120 }} style={{ color: "green" }} />}
                    {pc.computer_status == 1 &&
                        <ComputerIcon sx={{ fontSize: 120 }} style={{ color: "red" }} />}
                </Grid>

                <Grid item xs={12} justifyContent="center" >
                    <p style={{ wrap: "wrap", textAlign: "center" }}>{pc.computer_name}
                        <br /> Next booking on this computer : {nextBooking}
                    </p>
                    {nextBookingDuration && <p style={{ wrap: "wrap", textAlign: "center" }}>
                        Duration : {nextBookingDuration[0] + "h" + nextBookingDuration[1]}
                    </p>}

                </Grid>


            </Grid>
        </Grid>
    );
}