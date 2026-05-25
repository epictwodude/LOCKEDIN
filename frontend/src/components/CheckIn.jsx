import { useState } from "react"

function Result({message}){
    return (
        <div>
            <br />
            <hr />
            <br />
            <p>{message}</p>
            <br />
            <hr />
            <br />
        </div>
    )
}

function CheckIn() {
    const [energy, setEnergy] = useState(3)
    const [mood, setMood] = useState(3)
    const [plan, setPlan] = useState("")

    const [response, setResponse] = useState(null)

    const handleSubmit = async() => {
        const res = await fetch("http://localhost:8000/checkin", {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({energy, mood, plan})
        })
        const data = await res.json()
        await setResponse(data.message)

    }

    return (
        <div>
            <h2>Daily Check-in</h2>
            
            <p>Energy: {energy}</p>
            <input type="range" min="1" max="5" value={energy} 
                onChange={e => setEnergy(Number(e.target.value))} />
            
            <p>Mood: {mood}</p>
            <input type="range" min="1" max="5" value={mood} 
                onChange={e => setMood(Number(e.target.value))} />
            
            <p>What's the plan today?</p>
            <input type="text" value={plan} 
                onChange={e => setPlan(e.target.value)} />
            
            <button onClick={handleSubmit}>Submit</button>

            {response && <Result message={response}></Result>}

        </div>
    )
}

export default CheckIn