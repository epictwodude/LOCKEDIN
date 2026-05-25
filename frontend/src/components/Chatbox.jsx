import { useState } from "react"

function Chatbox(){
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage = { role : "user", content : input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)

        const res = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history : messages, message : input })
        })
        const data = await res.json()

        const buddyMessage = { role: "buddy", content: data.reply }
        setMessages(prev => [...prev, buddyMessage])
        setLoading(false)
    }

    return (
        <div>
            <h2>LOCKEDIN Buddy</h2>
            <div>
                {messages.map((msg, i) => (
                    <p key={i}><strong>{msg.role}:</strong> {msg.content}</p>
                ))}
                {loading && <p>Buddy is thinking...</p>}
            </div>
            <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Talk to your buddy..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    )

}

export default Chatbox
