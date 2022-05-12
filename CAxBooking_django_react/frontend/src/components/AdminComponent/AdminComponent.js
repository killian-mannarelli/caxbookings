import React, { useEffect } from 'react';
import Header from '../HeaderComponent/Header';
import Selection from './SelectionComponent/SelectionComponent';
import { Container } from '@mui/material';

import './AdminStyle.css';
import Axios from 'axios';

export default function Admin() {
  const [content, setContent] = React.useState()
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
    <div className="Admin2">
      <Header currentUser={currentUser} />
      <Container className="Admin" >

        <Selection setContent={setContent} currentUser={currentUser} />
        <Container id='AdminContent'>
          {content && content}
        </Container >

      </Container>
    </div>
  );
}
