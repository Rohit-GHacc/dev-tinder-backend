const validator = require('validator')
const validation = (req)=>{
    const {firstName, lastName, email, password} = req.body

    if(!firstName || !lastName ){
        throw new Error("Enter your name.")
    }else if(firstName.length < 3 || firstName.length> 50 || lastName.length < 3 || lastName.length > 50){
        throw new Error("Invalid name.")
    }
    if(!validator.isEmail(email)){
        throw new Error('Invalid email id')
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Weak password")
    }

}

module.exports = { validation }