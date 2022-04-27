import React, { Component } from "react";
import "./roomlayout.css";
import Header from "../MainPageComponent/Header";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PcComponent from "./PcComponent";
import Container from '@mui/material/Container';

export default class RoomLayout extends Component {

  rooms = [];

  constructor(props) {
    super(props);
    this.state = { computers: [], roomId : 1, roomName : "Room 1" };
    
    
    


  }


  render() {
    return (

      <div >
        <Header />
        <p>{this.state.roomName}</p>
        <Container>
        <Box sx={{
          border: '1px solid #595850',
          borderRadius: '40px',
        }}>

        <Grid container spacing={3} wrap="wrap" direction = "row" alignItems ="center">
          {this.state.computers.map((pc) =>
              <PcComponent pc={pc}  />
          )}

          </Grid>
          </Box>
          </Container>
      </div>
    );
  };

  


  fetchApi() {
    let url = window.location.href;
    let roomIdd = url.split("room_id=")[1].split("&")[0];
    let startTime = url.split("start=")[1].split("&")[0];
    let endTime = url.split("stop=")[1].split("&")[0];
    if(roomIdd === undefined || startTime === undefined || endTime === undefined){
      roomIdd = 1;
      startTime = "2002-07-13T16:30:00Z";
      endTime = "2002-07-13T17:00:00Z";
    };

   

    fetch("http://127.0.0.1:8000/api/computerinroom?room_id="+roomIdd +"&time_span_start=" + startTime + "&time_span_end=" + endTime, {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      
      this.setState({ computers: list });
      this.setState({roomId : roomIdd});
      this.fetchToGetRoom();
    }.bind(this));
  }

  fetchToGetRoom() {
    
    //take the room id from the state
    let roomId = this.state.roomId;
    //fetch the room name
    fetch("http://127.0.0.1:8000/api/rooms/search?room_id="+roomId, {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      this.setState({ roomName: list[0].name });
    }.bind(this));
  }

  componentDidMount() {
this.fetchApi();

    
      
    
    
  }
}


