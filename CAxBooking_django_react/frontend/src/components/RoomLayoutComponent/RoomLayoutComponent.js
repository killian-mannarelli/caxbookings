import React, { Component } from "react";
import "./roomlayout.css";
import Header from "../MainPageComponent/Header";

function ComputerList(props) {
  const pcs = props.pcs;
  const listItems = pcs.map((pc) =>
    <li key={pc.id}>
      {pc.name + " " + pc.status}
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
    let id = url.substring(url.lastIndexOf('/') + 1);


    fetch("http://127.0.0.1:8000/api/computers/search?room_id=" + id , {
      method: "GET"
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var list = JSON.parse(data);
      
      this.setState({ computers: list });
    }.bind(this));
  }
}


