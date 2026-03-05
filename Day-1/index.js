const express = require("express")
const app = express()

app.use(express.json())

const notes = []

app.post('/notes',(req,res)=>{
    // console.log(req.body)
    notes.push(req.body)
    res.status(201).json({
        message:"creating successfully",notes
    })
    
    // console.log(notes)
})


app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
