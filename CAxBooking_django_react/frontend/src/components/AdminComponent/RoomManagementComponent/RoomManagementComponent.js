import React from 'react';
import RoomCreationComponent from './RoomCreationComponent';
import RoomDisplayComponent from './RoomDisplayComponent';
import "./style.css";

export default function RoomManagementComponent() {
    return (
        <div className="RoomManagementComponent">
            <RoomCreationComponent />
            <RoomDisplayComponent />
        </div>
    );
}
