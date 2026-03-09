import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.scss";
import { Trash2, Pencil } from "lucide-react";

const API = "http://localhost:3000/note";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const res = await axios.get(API);
      setNotes(res.data.note);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (edit) {
        await axios.patch(`${API}/${edit}`, { title, description });
      } else {
        await axios.post(API, { title, description });
      }

      getNotes();
      setTitle("");
      setDescription("");
      setEdit(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEdit(note._id);
  };

  return (
    <div className="main">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="create">
            {edit ? "Update Note" : "Create Note"}
          </button>
        </form>
      <div className="notes">
        <h1>Notes</h1>

        {notes.map((note) => (
          <div className="note" key={note._id}>
            <div className="title">{note.title}</div>
            <div className="description">{note.description}</div>

            <button
              className="update-btn"
              onClick={() => handleEdit(note)}
            >
              <Pencil size={20} />
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(note._id)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default App;
