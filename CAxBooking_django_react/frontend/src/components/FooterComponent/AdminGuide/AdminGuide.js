import React, { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'

export default function UserGuide(props) {
    const [content, setContent] = useState();

    useEffect(() => {
        fetch("AdminGuide.md")
            .then((res) => res.text())
            .then((text) => setContent(text))
    })
    
    return (
        <div id="adminGuide">
            <div id="adminGuideContent" className="markdown-body background">
                <ReactMarkdown children={content} />
            </div>
        </div>
    );
}