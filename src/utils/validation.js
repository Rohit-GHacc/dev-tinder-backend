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
const validateEditFields = (req)=>{
    const ALLOWED_FIELDS = ['firstName','lastName','skills','about','photoURL','age','gender']

    const isAllowed = Object.keys(req.body).every(key=>ALLOWED_FIELDS.includes(key))
    // console.log(isAllowed)
    const updatedFields = Object.keys(req.body)
    console.log(updatedFields)
    if(updatedFields.includes('firstName')){
        const firstName = req.body['firstName']
        console.log(firstName)
        if(!firstName || firstName.length < 3 || firstName.length > 50)
            throw new Error('Invalid First Name.')
    }
    if(updatedFields.includes('lastName')){
        const lastName = req.body['lastName']

        if(!lastName || lastName.length < 3 || lastName.length > 50)
            throw new Error('Invalid Last Name.')
    }
    if(updatedFields.includes('photoURL')){
        const photoURL  = req.body['photoURL']
        // console.log(req.body)
        if(!validator.isURL(photoURL,{
                require_protocol: true,
                allow_query_components: true
            }))
            throw new Error('Invalid photo URL.')
    }
    if(!isAllowed){
        throw new Error('Not valid fields.')
    }
    
}

module.exports = { validation, validateEditFields }