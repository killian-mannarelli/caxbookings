import React, { useEffect } from "react";
import Axios from "axios"
import "./loginstyle.css"
import { Logout } from "@mui/icons-material";

/* It's a React component that renders a login form */
export default function Login() {

    function login() {
        Axios.post("http://127.0.0.1:8000/api/login/", {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        }).then(res => {
            window.location.href = "/"
        })
    }



    return (
        <div id="loginDiv">

        <form >
            <label>
                <input type="text" id="username" name="username" placeholder="USERNAME" className="textbox" />
            </label>
            <label>
                <input id="password" type="password" name="password" placeholder="PASSWORD" className="textbox" />
            </label>
            <input type="button" value="LOGIN" onClick={() => {
                login()
            }} className="CAxButton" />
        </form>
            </div>
    );
}