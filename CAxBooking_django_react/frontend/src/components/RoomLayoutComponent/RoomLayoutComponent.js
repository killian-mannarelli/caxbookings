import React, { Component, useEffect } from "react";
import "./roomlayout.css";
import Header from "../MainPageComponent/Header";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PcComponent from "./PcComponent";
import Container from '@mui/material/Container';
import TimeSpan from "../MainPageComponent/TimeSpanComponent/TimeSpan";
import Axios from "axios";

export default function RoomLayout(props) {

  const [computers, setComputers] = React.useState([]);
  const [urlInfos, setUrlInfos] = React.useState(null);
  const [roomName, setRoomName] = React.useState("");

  useEffect(() => {
    scrapUrl();


  }, []

  );

  useEffect(() => {
    if (urlInfos == null) return;
    fetchApi();
    fetchToGetRoom();
  }, [urlInfos]);

  
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
      //console.log(computers);
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
              <PcComponent pc={pc} />
            )}

          </Grid>
        </Box>
      </Container>
    </div>
  );

  

  





}


