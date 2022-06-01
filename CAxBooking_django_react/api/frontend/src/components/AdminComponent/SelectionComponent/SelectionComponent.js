import React, { useEffect } from 'react';
import AccountManagement from '../AccountManagementComponent/AccountManagementComponent';
import ComputerManagement from '../ComputerManagementComponent/ComputerManagementComponent';
import RoomEquipmentManagement from '../RoomEquipmentManagementComponent/RoomEquipmentManagementComponent';
import Stats from '../StatsComponent/StatsComponent';
import "./style.css";
import RoomDisplayComponent from '../RoomManagementComponent/RoomDisplayComponent';

/**
 * It returns a div with four buttons that, when clicked, change the content of the page to the
 * corresponding page
 * @param props - This is the object that contains all the parameters that were passed to the
 * component.
 * @returns A div with a bunch of buttons.
 */
export default function Selection(props) {

    return (
        <div id='Selection' className='background'>

            <button className="login-logout CAxButton" onClick={() => {
                props.setContent(<Stats currentUser={props.currentUser} />)
            }} >Stats</button>

            <button className="login-logout CAxButton" onClick={() => {
                props.setContent(<RoomDisplayComponent currentUser={props.currentUser} />)
            }}>Rooms</button>

            <button className="login-logout CAxButton" onClick={() => {
                props.setContent(<RoomEquipmentManagement currentUser={props.currentUser} />)
            }}>Equipments</button>

            <button className="login-logout CAxButton" onClick={() => {
                props.setContent(<ComputerManagement currentUser={props.currentUser} />)
            }}>Computers</button>

            <button className="login-logout CAxButton" onClick={() => {
                props.setContent(<AccountManagement currentUser={props.currentUser} />)
            }}>Users</button>
        </div>
    )
}