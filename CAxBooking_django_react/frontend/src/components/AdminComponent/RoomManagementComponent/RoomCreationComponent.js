import React from "react";
import axios from "axios";
import "./style.css";

export default function RoomCreationComponent(props) {
    //return a form that will create a room
    //only one field for the room name
    //and a button to create the room


    const createRoom = () => {
        //recover the room name from the input
        let roomName = document.getElementById("roomName").value;
        //create the room
        axios.post("http://127.0.0.1:8000/api/rooms/create", {
            room_name: roomName
        }).then(res => {
            console.log(res.data);

        });
            
            
    }

    return (
        <div className="RoomCreationComponent">
            <form>
                <label>Room name</label>
                <input type="text" id = "roomName"/>
                
            </form>
            <button className="login-logout CAxButton" onClick={createRoom}>Create</button>
        </div>
    );

    }