import React, { Component, useEffect } from "react";
import "./roomlayout.css";
import Header from "../HeaderComponent/Header";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PcComponent from "./PcComponent";
import Container from '@mui/material/Container';
import TimeSpan from "../MainPageComponent/TimeSpanComponent/TimeSpan";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Axios from "axios";

export default function RoomLayout(props) {

  const [computers, setComputers] = React.useState([]);
  const [urlInfos, setUrlInfos] = React.useState(null);
  const [roomName, setRoomName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedComputer, setSelectedComputer] = React.useState(null);
  const [ongoinguserbookings, setOngoingUserBookings] = React.useState(null);
  let [currentUser, setCurrentUser] = React.useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);



  const fetchCurrentUser = () => {
    Axios.get("http://127.0.0.1:8000/api/users/getCurrent").then(res => {
      console.log(res.data);
      setCurrentUser(res.data[0]);
    }
    );
  }


  useEffect(() => {
    getOngoingBookings();
    scrapUrl();
  }, []

  );

  useEffect(() => {
    if (urlInfos == null) return;
    fetchApi();
    fetchToGetRoom();
    getOngoingBookings();
  }, [urlInfos, open]);

  useEffect(() => {
    return;
  }, [computers]);

  const callBackFromTimeSpan = (day, start, end) => {

    let StartDate = new Date(day.toISOString());
    StartDate.setHours(start.getHours() + 2);
    StartDate.setMinutes(start.getMinutes());
    StartDate.setSeconds(0);
    StartDate.setMilliseconds(0);
    let EndDate = new Date(day.toISOString());
    EndDate.setHours(end.getHours() + 2);
    EndDate.setMinutes(end.getMinutes());
    EndDate.setSeconds(0);
    EndDate.setMilliseconds(0);


    let newUrlInfos = {
      roomId: urlInfos.roomId,
      startTime: StartDate,
      endTime: EndDate,
      day: day
    }
    setUrlInfos(newUrlInfos);
  }

  const fetchApi = () => {
    let startStringIso = urlInfos.startTime.toISOString();
    let endStringIso = urlInfos.endTime.toISOString();
    Axios.get("http://127.0.0.1:8000/api/computerinroom?room_id=" + urlInfos.roomId + "&time_span_start=" + startStringIso + "&time_span_end=" + endStringIso).then(res => {
      setComputers(res.data);
    });
  }

  const fetchToGetRoom = () => {
    //fetch the room name
    fetch("http://127.0.0.1:8000/api/rooms/search/specific?room_id=" + urlInfos.roomId, {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      setRoomName(list[0].name);
    });

  }

  const scrapUrl = () => {
    let url = window.location.href;
    let startToAdd = new Date(url.split("start=")[1].split("&")[0]);
    let endToAdd = new Date(url.split("stop=")[1].split("&")[0]);
    startToAdd.setHours(startToAdd.getHours());
    endToAdd.setHours(endToAdd.getHours());

    let newUrlInfos = {
      roomId: url.split("room_id=")[1].split("&")[0],
      startTime: startToAdd,
      endTime: endToAdd,
      day: new Date(url.split("start=")[1].split("&")[0])

    }
    setUrlInfos(newUrlInfos);
  }

  const handleClickOpen = (data) => {
    setSelectedComputer(data);
    if (data.computer_status == 1) {
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    makeBooking();
  };

  const handleNo = () => {
    setOpen(false);
  };

  const checkIfUserHas3Hours = () => {
    //Use ongoinguserbookings
    //for each object in ongoinguserbookings
    //calculate the time between start and end and add it to a variable
    //if the variable is greater than 3 hours return true
    //else return false
    let time = 0;
    for (let i = 0; i < ongoinguserbookings.length; i++) {
      let start = new Date(ongoinguserbookings[i].start);
      let end = new Date(ongoinguserbookings[i].end);
      time += (end - start) / 3600000;
    }
    console.log(time);
    if (time > 3) {
      return true;
    }
    return false;

  }


  const makeBooking = () => {
    
    let startStringIso = urlInfos.startTime.toISOString();
    let endStringIso = urlInfos.endTime.toISOString();
    /**Look into the ongoingbookings if there is one at the same moment and if yes send an alert to the user */
    let ongoingBooking = ongoinguserbookings.filter(booking => {
      console.log("oui")

      let startDate = new Date(booking.start);
      let endDate = new Date(booking.end);
      console.log(urlInfos.startTime.getTime());
      console.log(startDate.getTime())

      if (startDate.getTime() >= urlInfos.startTime.getTime() && endDate.getTime() <= urlInfos.endTime.getTime()) {
        return true;
      }
      if(startDate.getTime() <= urlInfos.startTime.getTime() && endDate.getTime() >= urlInfos.endTime.getTime()){
        return true;
      }
      if(startDate.getTime() <= urlInfos.startTime.getTime() && endDate.getTime() <= urlInfos.endTime.getTime() && endDate.getTime() >= urlInfos.startTime.getTime()){
        return true;
      }

    }, []);

    console.log(ongoingBooking);
    if (checkIfUserHas3Hours()) {
      alert("You already have 3 hours of bookings ! ");
      return;
    }

    if (ongoingBooking.length > 0) {
      alert("You already have a booking at this time ! ");
      return;
    }


    Axios.post("http://127.0.0.1:8000/api/bookings/create", {
      computer: selectedComputer.computer_id,
      start: startStringIso,
      end: endStringIso,
    }
    ).then(res => {
      setOpen(false);
      setSelectedComputer(null);
      getOngoingBookings();

    });
  }

  const getOngoingBookings = () => {
    Axios.get("http://127.0.0.1:8000/api/bookings/user/ongoing").then(res => {
      setOngoingUserBookings(res.data);
    });
  }

  return (

    <div className="page">
      
      <Header currentUser={currentUser} />
      <p id="roomName">{roomName + ' :'}</p>
      <TimeSpan
        day={urlInfos?.day}
        start={urlInfos?.startTime}
        end={urlInfos?.endTime}
        callback={callBackFromTimeSpan}
      />
      <div className="roomLayout">

        <Container id='RoomLayout'>
          <Box sx={{
            border: '1px solid #595850',
            borderRadius: '40px',
          }}>

            <Grid container spacing={3} wrap="wrap" direction="row" alignItems="center">
              {computers.map((pc) =>
                <PcComponent pc={pc} onClick={handleClickOpen} />
              )}

            </Grid>
          </Box>
          <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Book this computer ?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Do you want to book this computer for this time :
                {selectedComputer?.computer_name ?? "placeholder"} ,
                from {urlInfos?.startTime.toLocaleString() ?? "placeholder"} to {urlInfos?.endTime.toLocaleString() ?? "placeholder"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNo}>No</Button>
              <Button onClick={handleClose}>Yes</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </div>
  );









}


