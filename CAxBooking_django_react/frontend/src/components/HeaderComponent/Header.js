import { CurrencyYenTwoTone } from '@mui/icons-material';
import React, {useEffect} from 'react';
import './HeaderStyle.css';
import Axios from 'axios';

export default function Header() {
  let [currentUser, setCurrentUser] = React.useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);



  const fetchCurrentUser = () => {
    Axios.get("http://127.0.0.1:8000/api/users/getCurrent").then(res => {
      console.log(res.data);
      setCurrentUser(res.data[0]);
    }
    );
  }

  return (
    <div className="Header">
      <a href="http://127.0.0.1:8000/" id='logo-link'>
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Logo_Jade_Hochschule.jpg"></img>
      </a>
      <h1>Computer booking service</h1>


      {(currentUser?.is_superuser ?? false) == true && 
      <a href="http://127.0.0.1:8000/admin" id="Admin-button">
        <button className="login-logout CAxButton">Admin</button>
      </a>}
      <a href="http://127.0.0.1:8000/logout" id="Logout-button">
        <button className="login-logout CAxButton">Logout</button>
      </a>
    </div>
  );
}