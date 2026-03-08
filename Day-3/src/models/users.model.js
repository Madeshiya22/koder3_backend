import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({

  userName:{
    type:String,
    required:true,
    unique:true,
    min:8,
  },
  age:Number,
  email:String,
  gender:{
    type:String,
    enum:["male","female","other"],
    require:true
  }

})

export default mongoose.model("user",userSchema)