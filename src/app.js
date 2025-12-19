const express = require("express");
const db = require("./config/database");
const User = require('./models/user')
const app = express();

app.post('/createUser',async (req,res)=>{
    const dummyUser = {
        firstName : 'Virat',
        lastName : 'Kohli',
        email : 'virat@kohli.com',
        password : 'rohit'
    }
    try{
        const user = new User(dummyUser)
        await user.save();
        // console.log(User(dummyUser))
        res.send('user created successfully')
    }
    catch(err){
        res.status(400).send('Error while creating the user')
    }

})
// EXPORTED connectDB FROM database.js AND CHANGED THE VARIABLE NAME TO db  AND STILL WORKED
db().then(() => {
    console.log('Connected to database successfully')
    app.listen(7777, () => {
        console.log("Server running on port 7777 successfully.");
    });
})
.catch((err)=>{
    console.error('Database connection failed :(')
})

