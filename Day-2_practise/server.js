import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

const notes = [];

app.post("/notes", (req, res) => {
  notes.push(req.body);
  console.log(notes);

  res.status(201).json({
    message: "notes created successfully",
  });
});

app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "notes fetch successfully",
    notes,
  });
});

app.delete("/notes/:index", (req, res) => {
  const index = req.params.index;
  delete notes[index];
  res.status(200).json({
    message: "deleted successfully",
  });
});

app.patch("/notes/:index", (req, res) => {
  const index = req.params.index;
  const { description } = req.body;

  notes[index].description = description;
  
  res.status(200).json({
    message: "update successfully",
  });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
