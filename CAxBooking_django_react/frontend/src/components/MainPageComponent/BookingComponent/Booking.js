import React, { useEffect, useState } from 'react';
import BookingPopup from './BookingPopup';

export default function Booking(props) {

    const [computerName, setComputerName] = useState();
    const [computerRoom, setComputerRoom] = useState();
    const [roomName, setRoomName] = useState();


    
    const dateEnd = new Date(props.end);
    const dateStart = new Date(props.start);
    dateStart.setHours(dateStart.getHours() - 2);
    dateEnd.setHours(dateEnd.getHours() - 2);
    const dateString = dateStart.toLocaleDateString("fr-FR", {
        day: "numeric",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        });
    let duration = (dateEnd.getTime() - dateStart.getTime()) / 60000;
    let durationMinutes = duration;
    let durationHours = Math.floor(durationMinutes / 60);
    durationMinutes = durationMinutes % 60;

    const popUpID = "PopupBookingNb" + props.booking;

    useEffect(() => {
        fetchComputer()
        fetchRoom();
        
    }, [computerRoom]);

    function fetchComputer() {
        fetch("http://127.0.0.1:8000/api/computers/search?computer_id=" + props.computer, {
            method: "GET"
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            let list = JSON.parse(data);
            setComputerName(list[0].name);
            setComputerRoom(list[0].room);
        }.bind(this));
    }

    function fetchRoom() {
        if (computerRoom !== undefined)
            fetch("http://127.0.0.1:8000/api/rooms/search/specific?room_id=" + computerRoom, {
                method: "GET"
            }).then(function (response) {
                return response.text();
            }).then(function (data) {
                let list = JSON.parse(data);
                setRoomName(list[0].name);
            }.bind(this));
    }

    function stringToDate(date) {
        let t = date.replace("T", " ").replace("Z", "").split(/[- :]/);
        return new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    }

    function splitStart() {
        let d = new Date(props.start);
        d = d.toLocaleDateString() + " - " + d.toLocaleTimeString();
        d = d.split(":");
        return (d[0] + ":" + d[1]);
    }

    function popUp() {
        let popup = document.getElementById(popUpID);
        let popupBack = document.getElementById("popup-back");
        popupBack.classList.toggle("show");
        popup.classList.toggle("show");
    }


    return (
        <div className='Booking' id={'BookingNb' + props.booking}>
            <p onClick={popUp}>{computerName && computerName} - {roomName  && roomName} - {dateString}</p>
            <BookingPopup
                id={props.booking}
                computer={computerName && computerName}
                room={roomName && roomName}
                date={dateString}
                close={popUp}
                cancel={props.cancel}
                duration={durationHours + "h" + durationMinutes + "min"} />
        </div>
    )
}
