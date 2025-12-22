const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        min: 18
    },
    gender:{
        type: String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender data is not valid.")
            }
        }
    },
    skills: {
        type: [String],
        
    },
    about: {
        type: String,
        default: "There's nothing much about me to tell."
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)
module.exports = User