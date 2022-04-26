import React, { Component } from "react";
import "./roomlayout.css";

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
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
    this.fetchApi();
    this.state = {computerids: []};
    

  }


  render() {
    return (
        
      <div >
        <h1>RoomLayout</h1>
        <div className = "container ">
        <NumberList numbers={this.state.computerids} />
        </div>
      </div>
    );
  }

   fetchApi(){
    let url = window.location.href;
     let id = url.substring(url.lastIndexOf('/') + 1);


    fetch("http://127.0.0.1:8000/api/computersearch?room_id="+id, { 
        method: "GET"
      }).then(function(response) {
        return response.text();
      }).then(function(data) {
        var list = JSON.parse(data);
        var listItems = list.map((item) =>
            <li key={item.id}>
                {item.id}
            </li>
        );
        this.setState({computerids: listItems});
        }.bind(this));
    }
}


