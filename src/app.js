const express = require("express");
const db = require("./config/database");
const User = require('./models/user')
const app = express();
app.use(express.json())
app.post('/createUser',async (req,res)=>{
    try{
        const user = new User(req.body)
        await user.save();
        // console.log(User(dummyUser))
        res.send('user created successfully')
    }
    catch(err){
        res.status(400).send('Error while creating the user')
    }

})

// DON'T FORGET TO USE ASYNC AWAIT
app.get('/feed',async (req,res)=>{
    try{
        const users = await User.find()
        res.send(users)
    }
    catch(err){
        res.status(400).send("Something went wrong.")
    }
})

app.get('/getUser', async (req,res)=>{
    try{
        const user = await User.find({email: req.body.email})
        res.send(user)
    }
    catch(err){
        res.status(400).send("Something went wrong.")
    }
})
// EXPORTED connectDB FROM database.js AND CHANGED THE VARIABLE NAME TO db  AND STILL WORKED
db()
.then(() => {
    console.log('Connected to database successfully')
    app.listen(7777, () => {
        console.log("Server running on port 7777 successfully.");
    });
})
.catch((err)=>{
    console.error('Database connection failed :(')
})

