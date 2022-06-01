import React, { useEffect } from 'react';
import Header from '../HeaderComponent/Header';
import Selection from './SelectionComponent/SelectionComponent';
import { Container } from '@mui/material';

import './AdminStyle.css';
import Axios from 'axios';
import Stats from './StatsComponent/StatsComponent';
import Footer from '../FooterComponent/Footer';

/**
 * The Admin function is the main function of the Admin page. It renders the Header, Selection, and the
 * content of the page. The content of the page is determined by the Selection component
 */
export default function Admin(props) {
  const [content, setContent] = React.useState(<Stats />)

  return (
    <div className="Admin" >

      <Selection setContent={setContent} currentUser={props.currentUser} />
      <div id='AdminContent' className='background'>
        {content && content}
      </div>

    </div>
  );
}
