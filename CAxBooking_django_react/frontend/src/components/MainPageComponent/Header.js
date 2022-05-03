import React from 'react';
import './HeaderStyle.css';

export default function Header() {
  return (
    <div className="Header">
      <a href="http://127.0.0.1:8000/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg"></img>
      </a>
      <h1>Computer booking service</h1>

      <a href="http://127.0.0.1:8000/logout" id="CAxLink">
        <button className="login-logout CAxButton">Logout</button>
      </a>
    </div>
  );
}