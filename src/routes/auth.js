const express = require('express')

const { validation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const authRouter = express.Router();

authRouter.post("/createUser", async (req, res) => {
  try {
    // VALIDATION IS MUST
    validation(req);

    const { firstName, lastName, email, password, skills, about, gender, age } = req.body;
    // ENCRYPTING PASSWORD
    const passwordHash = await bcrypt.hash(password, 10);

    // CREATING THE USER
    const user = new User({ firstName, lastName, email,skills ,about ,gender, age, password: passwordHash});
    await user.save();
    // console.log(User(dummyUser))
    res.send("user created successfully");
  } catch (err) {
    res.status(400).send("Error while creating the user" + err.message);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!validator.isEmail) {
      throw new Error("Invalid email");
    }
    // User registered or not
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    // password check
    const isPasswordRight = await user.validatePassword(password);
    if (!isPasswordRight) {
      throw new Error("Invalid credentials.");
    }
    // login
    // AFTER PASSWORD VALIDATION  CREATE A COOKIE
    // CREATE A JWT TOKEN
    // using mongooseSchema method : 
    const token = await user.getJWT();
    // console.log(token)
    res.cookie("token", token,{ expires: new Date(Date.now() + 900000), httpOnly: true });
    // ADD TOKEN TO COOKIE AND SEND THE RESPONSE BACK TO COOKIE
    res.send("Login successful !!!");
  } catch (err) {
    res.status(400).send("Login failed: " + err.message);
  }
});

authRouter.post('/logout',(req,res)=>{
  // res.cookie('token',null,{
  //   expires: new Date(0)
  // })
  // BETTER METHOD : 
  res.clearCookie('token')
  res.send('Logged out successfully.')
})
module.exports = authRouter