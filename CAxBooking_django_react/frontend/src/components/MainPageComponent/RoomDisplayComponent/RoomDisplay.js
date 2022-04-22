import "./RoomDisplayStyle.css"
import React from 'react';
const data = [
    { room_name: "H133", availability: "19h - 20h", computer_number: "19/20" },
    { room_name: "H113", availability: "12h - 16h", computer_number: "9/13" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "02/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
    { room_name: "H112", availability: "13h - 14h", computer_number: "2/10" },
]


export default function RoomDisplay() {
    return (
        <div className="RoomDisplay">
            <p>Available Rooms :</p>
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Room n°</th>
                        <th>Available From-To</th>
                        <th>Disponibility</th>
                        <th>---</th>
                        <th>---</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.room_name}</td>
                                <td>{val.availability}</td>
                                <td>{val.computer_number}</td>
                                <td>
                                    <a href="">
                                        <button className="stats-button CAxButton">Room stats</button>
                                    </a>
                                </td>
                                <td>
                                    <a href="">
                                        <button className="checkout-button CAxButton">Checkout</button>
                                    </a>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}