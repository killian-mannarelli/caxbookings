import React, { useEffect } from 'react';
import AccountManagement from '../AccountManagementComponent/AccountManagementComponent';
import ComputerManagement from '../ComputerManagementComponent/ComputerManagementComponent';
import RoomManagement from '../RoomManagementComponent/RoomManagementComponent';
import Stats from '../StatsComponent/StatsComponent';

export default function Selection(props) {

    return (
        <div id='Selection'>
            <div onClick={() => {
                props.setContent(<Stats />)
            }} >
                <button className="login-logout CAxButton">Stats</button>
            </div>

            <div onClick={() => {
                props.setContent(<RoomManagement/>)
            }}>
                <button className="login-logout CAxButton">Rooms</button>
            </div>

            <div onClick={() => {
                props.setContent(<ComputerManagement/>)
            }}>
                <button className="login-logout CAxButton">Computers</button>
            </div>

            <div onClick={() => {
                props.setContent(<AccountManagement/>)
            }}>
                <button className="login-logout CAxButton">Users</button>
            </div>
        </div>
    )
}