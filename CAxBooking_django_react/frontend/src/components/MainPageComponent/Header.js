import React from 'react';
import './HeaderStyle.css';

export default function Header() {
  return (
    <div className="Header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg"></img>
      <h1>Computer booking service</h1>

      <a href="http://127.0.0.1:8000/logout">
        <button className="login-logout CAxButton">Login / Logout</button>
      </a>
    </div>
  );
}