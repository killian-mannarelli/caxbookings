import React, { Component } from "react";
import axios from "axios"
import "./loginstyle.css"

/* It's a React component that renders a login form */
export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="login-container">
                <div className="container">
                    <header>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg"></img>
                        <h1>Computer reservation service</h1>
                    </header>
                    <form >
                        <label>
                            <input type="text" id="username" name="username" placeholder="USERNAME" className="textbox" />
                        </label>
                        <br />
                        <label>
                            <input id="password" type="password" name="password" placeholder="PASSWORD" className="textbox" />
                        </label>
                        <br />
                        <input type="button" value="LOGIN" onClick={this.login} className="loginbutton" />
                    </form>
                </div>
            </div>

        );

    }

    login() {
        let status = false;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        let headersList = {

            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        let bodyContent = "username=" + username + "&password=" + password;

        fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            console.log(data);

        }).then(function(){
            window.location.href = "/"
        })
        

    }
}