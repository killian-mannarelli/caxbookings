import React from "react";
import './Footer.css';

export default function Footer() {
    return (
        <div className="footer">
            <div id="space"> </div>
            <footer>
                <a href='/adminContact'>
                    Contact Admin
                </a>
                <a href='/userGuide'>
                    Tutorials
                </a>
            </footer>
        </div>
    );
}