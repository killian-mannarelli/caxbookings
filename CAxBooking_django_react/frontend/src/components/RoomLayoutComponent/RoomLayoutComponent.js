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
    //make of int in state
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
        <NumberList numbers={this.state.computerids} />

      </div>
    );
  }

   fetchApi(){
    fetch("http://127.0.0.1:8000/api/computersearch?room_id=2", { 
        method: "GET"
      }).then(function(response) {
        return response.text();
      }).then(function(data) {
        //make a list of all items of the main list of the json
        var list = JSON.parse(data);
        var listItems = list.map((item) =>
            <li key={item.id}>
                {item.id}
            </li>
        );
        //set the state of the list
        this.setState({computerids: listItems});
        }.bind(this));
    }
}


