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
import Footer from "../FooterComponent/Footer";
/**
 * It fetches the computers in a room at a given time, and displays them in a grid
 * @param props - The props that were passed to the component.
 * @returns a component.
 */

export default function RoomLayout(props) {

  const [computers, setComputers] = React.useState([]);
  const [urlInfos, setUrlInfos] = React.useState(null);
  const [roomName, setRoomName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedComputer, setSelectedComputer] = React.useState(null);
  const [ongoinguserbookings, setOngoingUserBookings] = React.useState(null);
  const [maximumbookingtime, setMaximumBookingTime] = React.useState(0);


  useEffect(() => {
    getOngoingBookings();
    scrapUrl();
    fetchMaxBookingTime();
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


  const fetchMaxBookingTime = () => {
    Axios.get("http://"+process.env.PRODIP+"/api/bookings/maxtime"
    ).then(res => {
      setMaximumBookingTime(res.data.max_booking_time);
    }
    );
  }



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
    Axios.get("http://"+process.env.PRODIP+"/api/computerinroom?room_id=" + urlInfos.roomId + "&time_span_start=" + startStringIso + "&time_span_end=" + endStringIso).then(res => {
      setComputers(res.data);
    });
  }

  const fetchToGetRoom = () => {
    //fetch the room name
    fetch("http://"+process.env.PRODIP+"/api/rooms/search/specific?room_id=" + urlInfos.roomId, {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      setRoomName(list[0].name);
    });

  }

  /**
   * It scrapes the url of the page and sets the state of the urlInfos object with the information it
   * finds
   */
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

  const checkIfUserHasNHours = () => {
    //Use ongoinguserbookings
    //for each object in ongoinguserbookings
    //calculate the time between start and end and add it to a variable
    //if the variable is greater than 3 hours return true
    //else return false
    let time = 0;
    let timespandifference = (urlInfos.endTime - urlInfos.startTime) / (1000 * 60 * 60);
    time = time + timespandifference;
    for (let i = 0; i < ongoinguserbookings.length; i++) {
      let start = new Date(ongoinguserbookings[i].start);
      let end = new Date(ongoinguserbookings[i].end);
      time += (end - start) / 3600000;




    }
    console.log(time);
    if (time >= maximumbookingtime) {
      return true;
    }
    return false;

  }

  /**
   * It takes the start and end time from the url, converts it to a string, then converts it back to a
   * date, then subtracts 2 hours from the hours, then returns the start and end time as a string
   * @returns const correctHoursString = () => {
   *     let startStringIso = urlInfos?.startTime.toISOString() ?? "2022-05-18T12:30:00.000Z";
   *     let endStringIso = urlInfos?.endTime.toISOString() ?? "2022-05-18T12:
   */
  const correctHoursString = () => {
    let startStringIso = urlInfos?.startTime.toISOString() ?? "2022-05-18T12:30:00.000Z";
    let endStringIso = urlInfos?.endTime.toISOString() ?? "2022-05-18T12:30:00.000Z";

    let correctStart = new Date(startStringIso)
    let correctEnd = new Date(endStringIso)

    correctStart.setHours(correctStart.getHours() - 2)
    correctEnd.setHours(correctEnd.getHours() - 2)


    return [correctStart.toLocaleTimeString(), correctEnd.toLocaleTimeString()]
  }

  /**
   * It checks if there is an ongoing booking at the same time as the one the user is trying to make.
   */
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
      if (startDate.getTime() <= urlInfos.startTime.getTime() && endDate.getTime() >= urlInfos.endTime.getTime()) {
        return true;
      }
      if (startDate.getTime() <= urlInfos.startTime.getTime() && endDate.getTime() <= urlInfos.endTime.getTime() && endDate.getTime() >= urlInfos.startTime.getTime()) {
        return true;
      }

    }, []);

    console.log(ongoingBooking);
    if (checkIfUserHasNHours()) {
      alert("You can't have more than " + maximumbookingtime + " hours of scheduled booking");
      return;
    }

    if (ongoingBooking.length > 0) {
      alert("You already have a booking at this time ! ");
      return;
    }


    Axios.post("http://"+process.env.PRODIP+"/api/bookings/create", {
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
    Axios.get("http://"+process.env.PRODIP+"/api/bookings/user/ongoing").then(res => {
      setOngoingUserBookings(res.data);
    });
  }

  return (

      <div className="roomLayout">
        <h2 id="roomName">{roomName + ' :'}</h2>

        <TimeSpan
          day={urlInfos?.day}
          start={urlInfos?.startTime}
          end={urlInfos?.endTime}
          callback={callBackFromTimeSpan}
        />



        <Container id='RoomLayout' className="background">
          <Box>

            <Grid container spacing={12} wrap="wrap" direction="row" alignItems="center">
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
                from {correctHoursString()[0]} to {correctHoursString()[1]}
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

};