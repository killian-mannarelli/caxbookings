import React from 'react';
import RoomCreationComponent from './RoomCreationComponent';
import RoomDisplayComponent from './RoomDisplayComponent';
import "./style.css";

export default function RoomManagement() {
    return (
        <div className="RoomManagement">
            <RoomCreationComponent />
            <RoomDisplayComponent />
        </div>
    );
}
