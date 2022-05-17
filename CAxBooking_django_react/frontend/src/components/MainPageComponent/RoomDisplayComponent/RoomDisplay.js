import "./RoomDisplayStyle.css"
import React, { useEffect } from 'react';



export default function RoomDisplay(props) {
    let realtimestart = new Date(props.start);
    let realtimeend = new Date(props.end)
    //add 2 hours to both
    realtimestart.setHours(realtimestart.getHours());
    realtimeend.setHours(realtimeend.getHours());
    //reconvert back in to string
    let start = realtimestart.toISOString();
    let end = realtimeend.toISOString();



    return (
        <div className="RoomDisplay">
            <p>Available Rooms :</p>
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Room n°</th>
                        <th>Disponibility</th>
                        <th>---</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rooms.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val?.room_name ?? "Placeholder"}</td>
                                <td>{val?.room_current_capacity ?? 0}/{val?.room_capacity ?? 0}</td>
                                <td>
                                    <button className="checkout-button CAxButton" onClick={() => {
                                        window.location.replace("http://127.0.0.1:8000/room/room_id=" + val.room_id + "&start=" + start + "&stop=" + end);
                                    }}>Checkout</button>

                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}