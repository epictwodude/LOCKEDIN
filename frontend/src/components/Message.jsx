import { useState, useEffect } from "react"

function Message(){
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetch("http://localhost:8000")
            .then(res => res.json())
            .then(data => setMessage(data.message))
    }, [])

    return (
        <div>
            <p>{message}</p>
        </div>
    )
}

export default Message