import React, { useEffect } from 'react';
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
                props.setContent(<p>aaaaaaaaaaaaaabs</p>)
            }}>
                <button className="login-logout CAxButton">Stats</button>
            </div>

            <div>
                <button className="login-logout CAxButton">Stats</button>
            </div>

            <div>
                <button className="login-logout CAxButton">Stats</button>
            </div>
        </div>
    )
}