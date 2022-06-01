import React from "react";
import './AdminContact.css'


export default function AdminContact() {

    return (
        <div id="AdminContact">
            <div id="AdminContactContent" className="background">
                <h1>Admin Contact :</h1>
                <p>
                    If you need to contact an admin please use this email adress :
                </p>
                <p className="warn">
                    admin@admin.admin
                </p>
            </div>
        </div>

    );
}