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


  return (
    <header className="Header">

      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg" onClick={() => {
        window.location.replace("http://127.0.0.1:8000/")
      }}></img>

      <h1>Computer booking service</h1>



      {((props.currentUser?.is_superuser ?? false) || (props.currentUser?.is_staff ?? false)) &&
        <button id='Admin-button' className="login-logout CAxButton" onClick={() => {
          window.location.replace("http://127.0.0.1:8000/admin")
        }}>Admin</button>
      }
      {
        (props.currentUser != undefined) &&
        <button id='Logout-button' className="login-logout CAxButton" onClick={() => {
          window.location.replace("http://127.0.0.1:8000/logout")
        }}>Logout</button>
      }

    </header>
  );
}