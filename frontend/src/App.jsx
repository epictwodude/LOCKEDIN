import { useState, useEffect } from "react"
import Message from "./components/Message"
import CheckIn from "./components/CheckIn"
import Chatbox from "./components/Chatbox"
import TaskManager from "./components/TaskManager"

function App() {

  return (
    <div>
      <h1>LOCKEDIN</h1>
      <Message></Message>
      <br />
      <hr />
      <br />
      <CheckIn></CheckIn>
      <br />
      <hr />
      <br />
      <Chatbox></Chatbox>
      <br />
      <hr />
      <br />
      <TaskManager></TaskManager>
    </div>
  )
}

export default App