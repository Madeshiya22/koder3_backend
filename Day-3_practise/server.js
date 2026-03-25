import app from "./src/app.js";
import mongoose from "mongoose";
import noteModel from "./src/models/note.model.js";
import dotenv from "dotenv";
dotenv.config();

async function connectToDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("server is connected to DB");
}

connectToDB();

app.post("/note", async (req, res) => {
  const { title, description } = req.body;
  await noteModel.create({
    title: title,
    description: description,
  });

  res.status(201).json({
    message: "notes created successfully",
  });
});

app.get("/note", async (req, res) => {
  const note = await noteModel.find();
  console.log(note);

  res.status(200).json({
    message: "notes fetch successfully",
    note,
  });
});

app.delete("/note/:id", async (req, res) => {
  await noteModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "note deleted sucessffully",
  });
});

app.patch("/note/:id", async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  if (!title) return res.status(400).send("title is required..");
  await noteModel.findByIdAndUpdate(id, { title });

  res.status(200).json({
    message: "note update sucessfully",
  });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
