import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

let notes = []

app.post("/notes",(req,res)=>{
    notes.push(req.body)

    res.json({
        message:"Note created",
        data:notes
    })
})

app.get("/notes",(req,res)=>{
    res.json(notes)
})


app.delete("/notes/:index",(req,res)=>{
    const index = req.params.index

    delete notes[index]

    res.json({
        message:"Note deleted"
    })
})


app.patch("/notes/:index",(req,res)=>{
    const index = req.params.index
    const {description} = req.body

    notes[index].description = description

    res.json({
        message:"Note updated"
    })
})



app.listen(3000,()=>{
    console.log("server running on port 3000")
})