import React, { Component } from "react";
import "./roomlayout.css";
import Header from "../MainPageComponent/Header";

function ComputerList(props) {
  const pcs = props.pcs;
  const listItems = pcs.map((pc) =>
    <li key={pc.computer_id}>
      {pc.computer_status == 0 && 
       <img src="https://i.imgur.com/Rw4jZaq.png"/>}
      {pc.computer_status == 1 && 
      <img src = "https://i.imgur.com/bT42Ju5.png"  alt= "Not free"/> }
    </li>
    
  );
  return (
    <ul>{listItems}</ul>
  );
}

export default class RoomLayout extends Component {

  rooms = [];

  constructor(props) {
    super(props);
    this.state = { computers: [] };
    this.fetchApi();
    


  }


  render() {
    return (

      <div >
        <Header />
        <div className = "container ">
        <ComputerList pcs={this.state.computers} />
        </div>
      </div>
    );
  }

  fetchApi() {
    let url = window.location.href;
    //extract the parameters from this url http://127.0.0.1:8000/room/room_id=1&start=2002-07-13T16:30:00Z&stop=2002-07-13T17:00:00Z
    let roomId = url.split("room_id=")[1].split("&")[0];
    let startTime = url.split("start=")[1].split("&")[0];
    let endTime = url.split("stop=")[1].split("&")[0];
    if(roomId === undefined || startTime === undefined || endTime === undefined){
      roomId = 1;
      startTime = "2002-07-13T16:30:00Z";
      endTime = "2002-07-13T17:00:00Z";
    }




    fetch("http://127.0.0.1:8000/api/computerinroom?room_id="+roomId +"&time_span_start=" + startTime + "&time_span_end=" + endTime, {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      
      this.setState({ computers: list });
    }.bind(this));
  }
}


