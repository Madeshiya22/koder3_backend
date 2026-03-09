import mongoose from "mongoose";


const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        min:8,
    },
    description:String
})


export default mongoose.model('note',noteSchema)