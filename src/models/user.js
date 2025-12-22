const mongoose = require('mongoose')
const validator = require('validator')
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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address : "+ value)
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak password : " + value)
            }
        }
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
    },
    photoURL:{
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL : " + value)
            }
        }
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)
module.exports = User