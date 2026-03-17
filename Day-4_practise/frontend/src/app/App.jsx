import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/notes";

const App = () => {
  const [notes, setNotes] = useState([
    {
      title: "Note Title",
      description: "Note Description",
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        title: e.target[0].value,
        description: e.target[1].value,
      });
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };


  const getNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      <div className="main">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Note Title" />
          <textarea name="" id=""></textarea>
          <button>Create</button>
        </form>
        <div className="notes">
          {notes.map((note, index) => (
            <div className="note" key={index}>
              <div className="title">{note.title}</div>
              <div className="description">{note.description}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
