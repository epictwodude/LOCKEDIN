import { useState, useEffect } from "react"

function TaskManager() {
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [due_date, setDue_date] = useState("")

    const fetchTasks = async () => {
        const res = await fetch("http://localhost:8000/tasks")
        const data = await res.json()
        setTasks(data.tasks)
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const createTask = async () => {
        if (!title.trim()) return
        await fetch("http://localhost:8000/tasks", {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({ title: title, description: description, due_date: due_date })
        })
        setTitle("")
        setDescription("")
        setDue_date("")
        fetchTasks()
    }

    const updateStatus = async(taskId, newStatus) => {
        await fetch(`http://localhost:8000/tasks/${taskId}`, {
            method : "PATCH",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({ title: "", status: newStatus })
        })
        fetchTasks()
    }

    return (
        <div>
            <h2>Tasks</h2>
            <input type="text" placeholder="Task title" value={title}
                onChange={e => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description}
                onChange={e => setDescription(e.target.value)} />
            <input type="text" placeholder="Date (YYYY-MM-DD)" value={due_date}
                onChange={e => setDue_date(e.target.value)} />
            <button onClick={createTask}>Add Task</button>

            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <p><strong>{task.title}</strong> — {task.status}</p>
                        <button onClick={() => updateStatus(task.id, "in_progress")}>In Progress</button>
                        <button onClick={() => updateStatus(task.id, "done")}>Done</button>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default TaskManager