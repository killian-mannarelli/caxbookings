import React, { useEffect } from 'react';
import AccountManagement from '../AccountManagementComponent/AccountManagementComponent';
import ComputerManagement from '../ComputerManagementComponent/ComputerManagementComponent';
import RoomManagement from '../RoomManagementComponent/RoomManagementComponent';
import Stats from '../StatsComponent/StatsComponent';
import "./style.css";

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
        </div>
    )
}