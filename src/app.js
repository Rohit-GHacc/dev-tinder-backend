const express = require("express");
const db = require("./config/database");
const User = require("./models/user");
const app = express();
const { validation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth')
// CONVERTS JSON OBJECT TO JAVASCRIPT OBJECT
app.use(express.json());
app.use(cookieParser());

app.post("/createUser", async (req, res) => {
  try {
    // VALIDATION IS MUST
    validation(req);

    const { firstName, lastName, email, password } = req.body;
    // ENCRYPTING PASSWORD
    const passwordHash = await bcrypt.hash(password, 10);

    // CREATING THE USER
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    // console.log(User(dummyUser))
    res.send("user created successfully");
  } catch (err) {
    res.status(400).send("Error while creating the user" + err.message);
  }
});

app.get("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req
    // console.log(user)
    res.send(user);
  } catch (err) {
    res.status(400).send("Profile fetching failed : " + err.message);
  }
});
// DON'T FORGET TO USE ASYNC AWAIT
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

// DELETING USER API
app.delete("/deleteUser", async (req, res) => {
  try {
    // console.log(req.body.id)
    const user = await User.findByIdAndDelete(req.body.id);
    console.log(user);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

// UPDATING USING ID IN REQ.PARAMS, REMEMBER TO CHANGE ROUTE FOR PARAMS AS THEY ARE PART OF URL
app.patch("/updateUser/:id", async (req, res) => {
  try {
    const ALLOWED_FIELDS = ["skills", "age", "gender", "about", "password"];
    const isAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );
    if (!isAllowed) {
      throw new Error("You cannot update these fields.");
    }
    // console.log(req.body)
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    }); // by default it's before
    console.log(user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("UPDATE FAILED. " + err.message);
  }
});

app.patch("/updateUserWithEmail", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { runValidators: true }
    );
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("Update failed." + err.message);
  }
});

app.use((req, res) => {
  res.send("Hi Rohit");
});

// EXPORTED connectDB FROM database.js AND CHANGED THE VARIABLE NAME TO db  AND STILL WORKED
db()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(7777, () => {
      console.log("Server running on port 7777 successfully.");
    });
  })
  .catch((err) => {
    console.error("Database connection failed :(");
  });
