import  mongooose from "mongoose";

const userSchema = new mongooose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required if googleId is not provided
        }
        
    },
    fullname: {
        type: String,   
        required: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
});


userSchema.index({ username: "text" })

const usermodel = mongooose.model("User", userSchema);

export default usermodel; 