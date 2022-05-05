import React from 'react';
import Header from '../HeaderComponent/Header';
import Selection from './SelectionComponent/SelectionComponent';
import './AdminStyle.css';

export default function Admin() {
  return (
    <div className="Admin">
      <Header />
      <Selection />
      <div id='Admin-Content' />
    </div>
  );
}