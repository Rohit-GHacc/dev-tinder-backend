const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
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
        default: 'https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL : " + value)
            }
        }
    }
},{
    timestamps: true
})
// DON'T USE ARROW FUNCTION HERE
userSchema.methods.getJWT = async function(){
    const user = this;
    const SECRET_KEY = "Rohit is a good boy";
    const token =  jwt.sign({ id: user._id }, SECRET_KEY,{expiresIn: '1d'});
    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const passwordHash = user.password
    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid;
}
const User = mongoose.model("User", userSchema)
module.exports = User