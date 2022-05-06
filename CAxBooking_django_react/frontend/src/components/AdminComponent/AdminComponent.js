import React from 'react';
import Header from '../HeaderComponent/Header';
import Selection from './SelectionComponent/SelectionComponent';

import './AdminStyle.css';

export default function Admin() {
  const [content, setContent] = React.useState()

  return (
    <div className="Admin">
      <Header />
      <Selection setContent={setContent} />
      <div id='AdminContent'>
        {content && content}
      </div >

    </div>
  );
}
