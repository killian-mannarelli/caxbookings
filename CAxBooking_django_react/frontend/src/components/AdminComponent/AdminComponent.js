import React from 'react';
import Header from '../HeaderComponent/Header';
import Selection from './SelectionComponent/SelectionComponent';
import { Container } from '@mui/material';

import './AdminStyle.css';

export default function Admin() {
  const [content, setContent] = React.useState()

  return (
    <div className="Admin2">
    <Header />
    <Container className="Admin">
      
      <Selection setContent={setContent} />
      <Container id='AdminContent'>
        {content && content}
      </Container >

    </Container>
    </div>
  );
}
