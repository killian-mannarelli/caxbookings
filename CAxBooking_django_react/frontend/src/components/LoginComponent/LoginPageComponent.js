import React, { useEffect } from "react";
import Axios from "axios"
import "./loginstyle.css"
import { Logout } from "@mui/icons-material";

/* It's a React component that renders a login form */
export default function Login() {

    function login() {
        let CSRF_TOKEN = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        Axios.post("http://"+process.env.PRODIP+"/api/login/", {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        },{
            headers: {
                'X-CSRFToken': CSRF_TOKEN
            }

        }).then(res => {
            window.location.href = "/"
        })
    }



    return (
        <div id="loginDiv">

            <form onKeyPress={
                (event) => {
                    if (event.key === 'Enter') {
                        login();
                    }
                }
            }>
                <label className="formlabel">
                    <input type="text" name="username" id="username" placeholder="USERNAME" className="textbox" />
                </label>
                <label className="formlabel"   >
                    <input type="password" name="password" id="password" placeholder="PASSWORD" className="textbox" />
                </label>
                <input type="button" value="LOGIN" onClick={() => {
                    login();
                }} className="CAxButton" />
            </form>
        </div>
    );
}