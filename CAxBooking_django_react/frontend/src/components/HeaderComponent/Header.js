import { CurrencyYenTwoTone } from '@mui/icons-material';
import React, { useEffect } from 'react';
import './HeaderStyle.css';
import Axios from 'axios';

export default function Header(props) {

  return (
    <div className="Header">

      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg" onClick={() => {
        window.location.replace("http://127.0.0.1:8000/")
      }}></img>

      <h1>Computer booking service</h1>



      {((props.currentUser?.is_superuser ?? false) || (props.currentUser?.is_staff ?? false)) &&
        <button id='Admin-button' className="login-logout CAxButton" onClick={() => {
          window.location.replace("http://127.0.0.1:8000/admin")
        }}>Admin</button>
      }
      <button id='Logout-button' className="login-logout CAxButton" onClick={() => {
        window.location.replace("http://127.0.0.1:8000/logout")
      }}>Logout</button>

    </div>
  );
}