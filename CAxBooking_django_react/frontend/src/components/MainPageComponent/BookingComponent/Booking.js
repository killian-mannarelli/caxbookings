
import React from 'react';

export default function Booking(props) {

    let [computerName, setComputerName] = React.useState(fetchComputer);
    let [computerRoom, setComputerRoom] = React.useState(fetchComputer);
    let [roomName, setRoomName] = React.useState(fetchRoom());


    function fetchComputer() {
        fetch("http://127.0.0.1:8000/api/computers/search?computer_id=" + props.computer, {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            let list = JSON.parse(data);
            setComputerName(list[0].name);
            setComputerRoom(list[0].room);
            waitForElement()

        }.bind(this));
    }

    function waitForElement() {
        if (typeof computerRoom !== "undefined") {
            console.log("bbbb", computerRoom)
            return;
        }
        else {
            setTimeout(waitForElement, 250);
        }
    }

    function fetchRoom() {/*  */
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", computerRoom)
        if (typeof computerRoom !== "undefined") {
            fetch("http://127.0.0.1:8000/api/rooms/search?room_id=" + computerRoom, {
                method: "GET"
            }).then(function (response) {
                return response;
            }).then(function (data) {
                let list = JSON.parse(data);
                setRoomName(list[0].name);
            }.bind(this));
        } else {
        }
    }


    return (
        <p>{computerName} - {roomName} - hh:mm - dd/MM</p>
    )
}