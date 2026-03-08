import app from "./src/app.js";
import mongoose from "mongoose";
import noteModel from "./src/models/note.model.js";
import userModel from  "./src/models/users.model.js"

async function connectToDB() {
  await mongoose.connect(
"mongodb+srv://server:JV2hSGdXn6CDiULi@cluster0.22wui8u.mongodb.net/day-3"  );
 
  console.log("server is connected to DB");
}

connectToDB();

app.post("/notes", async (req, res) => {
  const { title, description } = req.body;
  await noteModel.create({
    title: title,
    description: description,
  });

  res.status(201).json({
    message: "notes created successfully",
  });
});

app.get("/notes", async (req, res) => {
  const notes = await noteModel.find({
    title:'Rahul Madeshiya'
  });
  console.log(notes);

  res.status(200).json({
    message: "notes fetch successfully",
    notes
  });
});



app.delete("/notes/:id", async (req, res) => {
  await noteModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "notes deleted successfully",
  });
});


app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;
  await noteModel.findByIdAndUpdate(id, { description });

  res.status(200).json({
    message: "notes deleted successfully",
  });
});




//=================== user CRUD =====================


app.post('/user',async(req,res)=>{
    const {userName,age,email,gender} = req.body;

    await userModel.create({
        userName:userName,
        age:age,
        email:email,
        gender:gender
    })

    res.status(201).json({
     message:"user create successfully"
    })
})  


app.get('/user',async(req,res)=>{
    const user = await userModel.find()
    console.log(user)

    res.status(200).json({
        message:"user fetch successfully",
        user
    })
})


app.delete('/user/:id', async(req,res)=>{
    await userModel.findByIdAndDelete(req.params.id)

     res.status(200).json({
        message:"user deleted successfully"
     })
})


app.patch('/user/:id',async(req,res)=>{
    const id  = req.params.id
    const {email} = req.body
    await userModel.findByIdAndUpdate(id,{email})

    res.status(200).json({
        message:"user update successfully"
    })

})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
