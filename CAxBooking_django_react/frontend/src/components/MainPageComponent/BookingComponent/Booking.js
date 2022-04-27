import React from 'react';

export default function Booking(props) {

    const [computerName, setComputerName] = React.useState();
    const [computerRoom, setComputerRoom] = React.useState();

    const [roomName, setRoomName] = React.useState();

    fetchComputer()

    function fetchComputer() {
        fetch("http://127.0.0.1:8000/api/computers/search?computer_id=" + props.computer, {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            let list = JSON.parse(data);
            setComputerName(list[0].name);
            setComputerRoom(list[0].room,fetchRoom());
        });
    }

    function fetchRoom() {
        fetch("http://127.0.0.1:8000/api/rooms/search?room_id=" + computerRoom, {
            method: "GET"
        }).then(function (response) {
            return response;
        }).then(function (data) {
            let list = JSON.parse(data);
            setRoomName(list[0].name);
        }.bind(this));
    }

    return (
        <p>{computerName} - {roomName} - hh:mm - dd/MM</p>
    )
}

