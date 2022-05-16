import { CurrencyYenTwoTone } from '@mui/icons-material';
import React, { useEffect } from 'react';
import './HeaderStyle.css';
import Axios from 'axios';

export default function Header(props) {

  return (
    <div className="Header">
      <a href="http://127.0.0.1:8000/" id='logo-link'>
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg"></img>
      </a>
      <h1>Computer booking service</h1>



      {((props.currentUser?.is_superuser ?? false) || (props.currentUser?.is_staff ?? false)) &&
        <a href="http://127.0.0.1:8000/admin" id="Admin-button">
          <button className="login-logout CAxButton">Admin</button>
        </a>}

      <a href="http://127.0.0.1:8000/logout" id="Logout-button">
        <button className="login-logout CAxButton">Logout</button>
      </a>
    </div>
  );
}