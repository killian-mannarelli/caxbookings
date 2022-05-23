import React, { useEffect } from 'react';
import AccountManagement from '../AccountManagementComponent/AccountManagementComponent';
import ComputerManagement from '../ComputerManagementComponent/ComputerManagementComponent';
import RoomManagement from '../RoomManagementComponent/RoomManagementComponent';
import RoomEquipmentManagement from '../RoomEquipmentManagementComponent/RoomEquipmentManagementComponent';
import Stats from '../StatsComponent/StatsComponent';
import "./style.css";

export default function Selection(props) {

    return (
        <div id='Selection' className='background'>
            <div onClick={() => {
                props.setContent(<Stats currentUser={props.currentUser}/>)
            }} >
                <button className="login-logout CAxButton">Stats</button>
            </div>

            <div onClick={() => {
                props.setContent(<RoomManagement currentUser={props.currentUser} />)
            }}>
                <button className="login-logout CAxButton">Rooms</button>
            </div>

            <div onClick={() => {
                props.setContent(<ComputerManagement currentUser={props.currentUser} />)
            }}>
                <button className="login-logout CAxButton">Computers</button>
            </div>

            <div onClick={() => {
                props.setContent(<AccountManagement currentUser={props.currentUser} />)
            }}>
                <button className="login-logout CAxButton">Users</button>
        </div>
            <div onClick={() => {
                props.setContent(<RoomEquipmentManagement currentUser={props.currentUser} />)
            }}>
                
            <button className="login-logout CAxButton">Equipments</button>
                
            </div>
        </div>
    )
}