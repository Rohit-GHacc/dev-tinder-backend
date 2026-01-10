const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userAuth = async function(req,res,next){
    try{
        const SECRET_KEY = 'Rohit is a good boy'
        const { token } = req.cookies
        if(!token){
            res.status(401).send("Please Login!")
        }
        const decodedObj = jwt.verify(token , SECRET_KEY)
        const { id } = decodedObj
        const user = await User.findById(id)
        if(!user){
            throw new Error('Invalid user.')
        }
        // attaching the user with the request body for further use in request handlers
        req.user = user
        // console.log(user)
        next();
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
}

module.exports = {
    userAuth
}