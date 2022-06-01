import "./RoomDisplayStyle.css"
import React, { useEffect, useState } from 'react';
import Axios from 'axios';



/**
 * It takes in a list of rooms and a start and end time, and then displays them in a table
 * @param props - {
 * @returns A table with the available rooms and their capacity.
 */
export default function RoomDisplay(props) {
    let realtimestart = new Date(props.start);
    let realtimeend = new Date(props.end)
   const [roomEquipments, setRoomEquipments] = useState(null);
    //add 2 hours to both
    realtimestart.setHours(realtimestart.getHours());
    realtimeend.setHours(realtimeend.getHours());
    //reconvert back in to string
    let start = realtimestart.toISOString();
    let end = realtimeend.toISOString();


    useEffect(() => {
        fetchRoomEquipment();
    }, []);




    const fetchRoomEquipment = () => {
        Axios.get("http://127.0.0.1:8000/api/rooms/allequipments").then(res => {
            setRoomEquipments(res.data)
        }
        );
    
      }
      


    const getEquipmentString = (room_id) => {
        let equipmentString = "";
        for (let i = 0; i < roomEquipments.length; i++) {
            if (roomEquipments[i].room_id == room_id) {
                equipmentString += roomEquipments[i].equipment_name + "; ";
            }
        }
        return equipmentString;
    }
    return (
        <div className="RoomDisplay">
            <p>Available Rooms :</p>
            <table className="content-table background">
                <thead>
                    <tr>
                        <th>Room n°</th>
                        <th>Disponibility</th>
                        <th>Equipments</th>
                        <th>---</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rooms.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val?.room_name ?? "Placeholder"}</td>
                                <td>{val?.room_current_capacity ?? 0}/{val?.room_capacity ?? 0}</td>
                                <td>{getEquipmentString(val?.room_id ?? 1)}</td> 
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