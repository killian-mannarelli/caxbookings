import React from "react";
import './Footer.css';

export default function Footer() {
    return (
        <div className="footer">
            <div id="space"> </div>
            <footer>
                <a>
                    contact admin
                </a>
                <a href='/userGuide'>
                    tutorials
                </a>
            </footer>
        </div>
    );
}