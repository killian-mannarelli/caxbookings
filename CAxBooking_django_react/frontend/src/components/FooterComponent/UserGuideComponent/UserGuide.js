import React, { useEffect, useState } from "react"
import './UserGuide.css'
import ReactMarkdown from 'react-markdown'

export default function UserGuide(props) {
    const [content, setContent] = useState();

    useEffect(() => {
        fetch("UserGuide.md")
            .then((res) => res.text())
            .then((text) => setContent(text))
    })

    return (
        <div id="UserGuide">

            <div id="userGuideContent" className="background">
                <ReactMarkdown children={content} />

            </div>
        </div>
    );
}