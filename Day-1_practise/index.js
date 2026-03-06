const express = require('express')
 const app = express()

 const notes = []

app.use(express.json())

 app.post('/notes',(req,res)=>{
  notes.push(req.body)

  res.status(201).json({
    messsage:"creating successfully"
  })
  console.log(notes)
 })

 app.listen(3000,()=>{
  console.log("server is running on port number 3000")
 })