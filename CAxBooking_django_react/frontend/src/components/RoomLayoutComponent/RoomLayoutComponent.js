import React, { Component, useEffect } from "react";
import "./roomlayout.css";
import Header from "../MainPageComponent/Header";
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


  useEffect(() => {
    getOngoingBookings();
    scrapUrl();
    

  }, []

  );

  useEffect(() => {
    if (urlInfos == null) return;
    fetchApi();
    fetchToGetRoom();
  }, [urlInfos, open]);

  useEffect(() => {
    return;
  }, [computers]);

  
  const callBackFromTimeSpan = (day, start, end) => {

    let StartDate = new Date(day.toISOString());
    StartDate.setHours(start.getHours());
    StartDate.setMinutes(start.getMinutes());
    StartDate.setSeconds(start.getSeconds());
    let EndDate = new Date(day.toISOString());
    EndDate.setHours(end.getHours());
    EndDate.setMinutes(end.getMinutes());
    EndDate.setSeconds(end.getSeconds());


   let newUrlInfos = {
      roomId : urlInfos.roomId,
      startTime : StartDate,
      endTime : EndDate,
      day : day
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
    fetch("http://127.0.0.1:8000/api/rooms/search?room_id=" + urlInfos.roomId, {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      setRoomName(list[0].name);
    });

  }

  const scrapUrl =  () => {
    let url = window.location.href;

    let newUrlInfos = {
      roomId: url.split("room_id=")[1].split("&")[0],
      startTime: new Date(url.split("start=")[1].split("&")[0]),
      endTime: new Date(url.split("stop=")[1].split("&")[0]),
      day: new Date(url.split("start=")[1].split("&")[0])

    }
    setUrlInfos(newUrlInfos);
  }


  const handleClickOpen = (data) => {
    setSelectedComputer(data);
    if(data.computer_status == 1 ){
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


  const makeBooking = () => {
    let startStringIso = urlInfos.startTime.toISOString();
    let endStringIso = urlInfos.endTime.toISOString();
    /**Look into the ongoingbookings if there is one at the same moment and if yes send an alert to the user */
    let ongoingBooking = ongoinguserbookings.filter(booking => {
      let startDate = new Date(booking.start);
      let endDate = new Date(booking.end);
      console.log(startDate.toISOString());
      if (startDate.getTime() >= urlInfos.startTime.getTime() && endDate.getTime() <= urlInfos.endTime.getTime()) {
        return true;
      }
    }, []);

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
  
    
  });
  }


  const getOngoingBookings = () => {
    Axios.get("http://127.0.0.1:8000/api/bookings/user/ongoing").then(res => {
      setOngoingUserBookings(res.data);
    });
  }



  
  

  return (

    <div >

      <Header />
      <p>{roomName}</p>
      <TimeSpan
        day={urlInfos?.day}
        start={urlInfos?.startTime}
        end={urlInfos?.endTime}
        callback={callBackFromTimeSpan}
      />

      <Container>
        <Box sx={{
          border: '1px solid #595850',
          borderRadius: '40px',
        }}>

          <Grid container spacing={3} wrap="wrap" direction="row" alignItems="center">
            {computers.map((pc) =>
              <PcComponent pc={pc} onClick =  {handleClickOpen}/>
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
  );

  

  





}

