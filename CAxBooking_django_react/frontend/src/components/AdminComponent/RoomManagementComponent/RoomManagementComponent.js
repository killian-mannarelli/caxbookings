import React from 'react';
import RoomCreationComponent from './RoomCreationComponent';
import RoomDisplayComponent from './RoomDisplayComponent';
import "./style.css";

/**
 * It returns a div with two components inside of it
 * @returns A div with two components inside of it.
 */
export default function RoomManagement() {
    return (
        <div className="RoomManagement">
            <RoomDisplayComponent />
        </div>
    );
}
