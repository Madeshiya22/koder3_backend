import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [notes,setNotes] = useState([])

  const getNotes = async ()=>{
    const res = await fetch("http://localhost:3000/notes")
    const data = await res.json()
    setNotes(data)
  }

  useEffect(()=>{
    getNotes()
  },[])

  const addNote = async ()=>{
    await fetch("http://localhost:3000/notes",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        title:"React",
        description:"Learning CORS"
      })
    })

    getNotes()
  }

  return (
    <div className="container">

      <h1>Notes App</h1>

      <button onClick={addNote}>
        Add Note
      </button>

      <div className="notes">

        {notes.map((note,index)=>(
          <div className="card" key={index}>
            <h3>{note?.title}</h3>
            <p>{note?.description}</p>
          </div>
        ))}

      </div>

    </div>
  )
}

export default App