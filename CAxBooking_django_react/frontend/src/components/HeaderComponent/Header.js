import { CurrencyYenTwoTone, PropaneSharp } from '@mui/icons-material';
import React, { useEffect } from 'react';
import './HeaderStyle.css';
import Axios from 'axios';

/**
 * It renders a header with a logo, a title, and a logout button
 * @param props - The props that are passed to the component.
 * @returns A div with a header and a button.
 */
export default function Header(props) {

  function login() {
    Axios.post("http://127.0.0.1:8000/api/login/", {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    }).then(res => {
      window.location.href = "/"
    })
  }


  return (
    <header className="Header">

      <img src="http://127.0.0.1:8000/JadeHsLogo" onClick={() => {
        window.location.replace("http://127.0.0.1:8000/")
      }}></img>

      <h1 onClick={() => {
        window.location.replace("http://"+process.env.PRODIP+"/")
      }}>Computer booking service</h1>



      {((props.currentUser?.is_superuser ?? false) || (props.currentUser?.is_staff ?? false)) &&
        <button id='Admin-button' className="login-logout CAxButton" onClick={() => {
          window.location.replace("http://"+process.env.PRODIP+"/admin")
        }}>Admin</button>
      }
      {
        (props.currentUser != undefined) &&
        <button id='Logout-button' className="login-logout CAxButton" onClick={() => {
          window.location.replace("http://"+process.env.PRODIP+"/logout")
        }}>Logout</button>
      }

      {
        (props.currentUser == undefined) &&
        <button id='Login-button' className="login-logout CAxButton" onClick={() => {
          window.location.replace("http://"+process.env.PRODIP+"/login")
        }}>Login</button>
      }

    </header>
  );
}